import fs from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import { normalizeCode } from './codes.js';

const MESSAGES = {
	does_not_exist: 'Whoops, that code doesn’t exist.',
	expired: 'Oops, that code has expired.',
	too_many_attempts: 'Too many attempts. Please wait a few minutes and try again.',
	unavailable: 'Sorry! Downloads are unavailable right now. Please try again later.',
};

const STATUS = {
	does_not_exist: 404,
	expired: 410,
	too_many_attempts: 429,
	unavailable: 503,
};

// Limits how many wrong codes one IP can try, so codes can't be guessed by
// brute force. Only failures count, so normal downloads are never throttled.
export function createFailureLimiter({ max, windowMs }) {
	const failures = new Map();
	const sweep = setInterval(() => {
		const now = Date.now();
		for (const [ip, entry] of failures) if (entry.resetAt <= now) failures.delete(ip);
	}, windowMs);
	sweep.unref();

	return {
		blocked(ip) {
			const entry = failures.get(ip);
			return Boolean(entry && entry.resetAt > Date.now() && entry.count >= max);
		},
		fail(ip) {
			const now = Date.now();
			const entry = failures.get(ip);
			if (!entry || entry.resetAt <= now) failures.set(ip, { count: 1, resetAt: now + windowMs });
			else entry.count++;
		},
	};
}

export function createApp({
	codes,
	albums,
	sitesDir,
	downloadsDir,
	trustProxy = 'loopback',
	accelRedirect = null,
	limiter = createFailureLimiter({ max: 20, windowMs: 10 * 60 * 1000 }),
}) {
	const app = express();
	app.set('trust proxy', trustProxy);
	app.disable('x-powered-by');
	// No ETags on downloads or API responses (static files keep theirs). This
	// has to be app-wide: res.download ignores a per-call `etag: false`.
	app.disable('etag');

	const albumsById = new Map(albums.map((album) => [album.id, album]));
	const sites = new Map(albums.map((album) => [album.id, express.static(path.join(sitesDir, album.id, 'public'))]));

	// <album>.grindselect.com (or <album>.localhost in development) → album
	app.use((req, res, next) => {
		req.album = albumsById.get(req.hostname?.split('.')[0]);
		next();
	});

	app.use('/shared', express.static(path.join(sitesDir, 'shared')));

	// Checks that the album's file exists, then redeems (or for HEAD, only
	// checks) the code. Resolves to 'ok' or an error key from MESSAGES.
	async function attempt(req, rawCode, { dryRun = false } = {}) {
		if (limiter.blocked(req.ip)) return 'too_many_attempts';

		try {
			await fs.access(downloadPath(req.album));
		} catch {
			console.error(`[${req.album.id}] download file is missing: ${downloadPath(req.album)}`);
			return 'unavailable';
		}

		const result = dryRun
			? await codes.check(req.album.id, rawCode)
			: await codes.redeem(req.album.id, rawCode);
		if (result !== 'ok') limiter.fail(req.ip);
		return result;
	}

	function downloadPath(album) {
		return path.join(downloadsDir, album.download);
	}

	app.post('/api/redeem', express.json({ limit: '1kb' }), async (req, res, next) => {
		if (!req.album) return next();
		try {
			const result = await attempt(req, req.body?.code);
			if (result !== 'ok') return res.status(STATUS[result]).json({ error: result });
			res.json({ download: `/download/${encodeURIComponent(normalizeCode(req.body.code))}` });
		} catch (err) {
			next(err);
		}
	});

	// Redeems the code and sends the file in one request. Old download links
	// (<album>.grindselect.com/download/<code>) keep working.
	app.get('/download/:code', async (req, res, next) => {
		if (!req.album) return next();
		try {
			// HEAD requests (link previews, download managers) never use up a code.
			const result = await attempt(req, req.params.code, { dryRun: req.method === 'HEAD' });
			if (result !== 'ok') return res.status(STATUS[result]).type('text').send(MESSAGES[result]);

			// Each download is gated by a code, so never let a browser revalidate a
			// cached copy: a 304 in answer to a download stalls the browser.
			res.set('Cache-Control', 'no-store');

			// Behind nginx, hand the file transfer to nginx (see README).
			if (accelRedirect) {
				res.attachment(req.album.download);
				res.set('X-Accel-Redirect', accelRedirect + encodeURI(req.album.download));
				return res.end();
			}

			for (const header of ['if-match', 'if-none-match', 'if-modified-since', 'if-unmodified-since']) {
				delete req.headers[header];
			}
			res.download(downloadPath(req.album), req.album.download, { cacheControl: false, lastModified: false }, (err) => {
				if (err && !res.headersSent) next(err);
			});
		} catch (err) {
			next(err);
		}
	});

	app.use((req, res, next) => {
		if (req.album) return sites.get(req.album.id)(req, res, next);
		next();
	});

	app.use((req, res) => {
		res.status(404).send('😳');
	});

	app.use((err, req, res, next) => {
		console.error(err);
		res.status(err.status || 500).send('😳');
	});

	return app;
}
