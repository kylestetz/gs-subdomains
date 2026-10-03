import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import albums from '../albums.js';
import config from '../server/config.js';
import { createApp, createFailureLimiter } from '../server/app.js';
import { createCodes } from '../server/codes.js';
import { connectTestDb, insertCode, request, HOUR } from './helpers.js';

async function startApp(t, { limiter, accelRedirect } = {}) {
	const collection = await connectTestDb(t);
	const downloadsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gs-downloads-'));
	fs.writeFileSync(path.join(downloadsDir, 'GS015-ABeaconSchool-Cola-(ExpandedVinylEdition).zip'), 'cola zip');
	fs.writeFileSync(path.join(downloadsDir, 'slagroom.zip'), 'slagroom zip');

	const app = createApp({
		codes: createCodes(collection, { windowMs: 24 * HOUR }),
		albums,
		sitesDir: config.sitesDir,
		downloadsDir,
		accelRedirect,
		...(limiter && { limiter }),
	});
	const server = app.listen(0);
	await new Promise((resolve) => server.once('listening', resolve));
	t.after(() => {
		server.close();
		fs.rmSync(downloadsDir, { recursive: true });
	});

	const port = server.address().port;
	return { collection, send: (options) => request(port, options) };
}

test('every album has a site', () => {
	for (const album of albums) {
		assert.ok(fs.existsSync(path.join(config.sitesDir, album.id, 'public/index.html')), album.id);
	}
});

test('nginx serves every album', () => {
	const conf = fs.readFileSync(path.join(import.meta.dirname, '../deploy/nginx.conf'), 'utf8');
	const [, names] = conf.match(/server_name ~\^\(\?<album>([^)]+)\)/);
	assert.deepEqual(names.split('|').sort(), albums.map((album) => album.id).sort());
});

test('sites are served by subdomain', async (t) => {
	const { send } = await startApp(t);

	const cola = await send({ host: 'cola.grindselect.com' });
	assert.equal(cola.status, 200);
	assert.match(cola.text, /A Beacon School — Cola/);

	const pare = await send({ host: 'pare.localhost' });
	assert.match(pare.text, /Parks Burton - Pare/);

	assert.equal((await send({ host: 'mirage.localhost', path: '/shared/code-input.js' })).status, 200);
	assert.equal((await send({ host: 'nope.grindselect.com' })).status, 404);
	assert.equal((await send({ host: 'localhost' })).status, 404);

	const slagroom = await send({ host: 'slagroom.localhost', path: '/download' });
	assert.equal(slagroom.status, 301);
	assert.equal(slagroom.headers.location, '/download/');
	assert.match((await send({ host: 'slagroom.localhost', path: '/download/' })).text, /enter your code/);
});

test('redeeming through the API', async (t) => {
	const { collection, send } = await startApp(t);
	await insertCode(collection, 'cola', 'ABC123');
	const redeem = (code, host = 'cola.localhost') => send({ host, method: 'POST', path: '/api/redeem', body: { code } });

	let res = await redeem('nope00');
	assert.equal(res.status, 404);
	assert.deepEqual(res.json(), { error: 'does_not_exist' });

	res = await redeem('ABC123', 'slagroom.localhost');
	assert.equal(res.status, 404, 'codes only work on their own album');

	res = await redeem('abc123');
	assert.equal(res.status, 200);
	assert.deepEqual(res.json(), { download: '/download/ABC123' });

	res = await send({ host: 'cola.localhost', path: '/download/ABC123' });
	assert.equal(res.status, 200);
	assert.equal(res.text, 'cola zip');
	assert.match(res.headers['content-disposition'], /attachment; filename="GS015-ABeaconSchool-Cola-\(ExpandedVinylEdition\)\.zip"/);

	const doc = await collection.findOne({ code: 'ABC123' });
	assert.equal(doc.count, 1);
	assert.deepEqual(doc.accessedAt.map((entry) => entry.action), ['use', 'download']);

	// used up and outside the window
	await collection.updateOne({ code: 'ABC123' }, { $set: { redeemedAt: new Date(Date.now() - 25 * HOUR) } });
	res = await redeem('ABC123');
	assert.equal(res.status, 410);
	assert.deepEqual(res.json(), { error: 'expired' });
});

test('downloading straight from a link', async (t) => {
	const { collection, send } = await startApp(t);
	await insertCode(collection, 'slagroom', 'SLAG01');

	const head = await send({ host: 'slagroom.localhost', method: 'HEAD', path: '/download/SLAG01' });
	assert.equal(head.status, 200);
	assert.equal((await collection.findOne({ code: 'SLAG01' })).count, 0, 'HEAD does not use the code');

	const res = await send({ host: 'slagroom.localhost', path: '/download/slag01' });
	assert.equal(res.status, 200);
	assert.equal(res.text, 'slagroom zip');
	assert.equal((await collection.findOne({ code: 'SLAG01' })).count, 1);

	const missing = await send({ host: 'slagroom.localhost', path: '/download/NOPE00' });
	assert.equal(missing.status, 404);
	assert.match(missing.text, /doesn’t exist/);
});

test('handing the file transfer to nginx', async (t) => {
	const { collection, send } = await startApp(t, { accelRedirect: '/_downloads/' });
	await insertCode(collection, 'cola', 'ABC123');

	const res = await send({ host: 'cola.localhost', path: '/download/ABC123' });
	assert.equal(res.status, 200);
	assert.equal(res.text, '');
	assert.equal(res.headers['x-accel-redirect'], '/_downloads/GS015-ABeaconSchool-Cola-(ExpandedVinylEdition).zip');
	assert.match(res.headers['content-disposition'], /attachment; filename="GS015-ABeaconSchool-Cola-\(ExpandedVinylEdition\)\.zip"/);
	assert.equal((await collection.findOne({ code: 'ABC123' })).count, 1);

	const missing = await send({ host: 'cola.localhost', path: '/download/NOPE00' });
	assert.equal(missing.status, 404);
	assert.equal(missing.headers['x-accel-redirect'], undefined);
});

test('codes are not used up when the album file is missing', async (t) => {
	const { collection, send } = await startApp(t);
	await insertCode(collection, 'pare', 'PARE01');

	const res = await send({ host: 'pare.localhost', method: 'POST', path: '/api/redeem', body: { code: 'PARE01' } });
	assert.equal(res.status, 503);
	assert.deepEqual(res.json(), { error: 'unavailable' });
	assert.equal((await collection.findOne({ code: 'PARE01' })).count, 0);
});

test('guessing codes gets rate limited', async (t) => {
	const { collection, send } = await startApp(t, { limiter: createFailureLimiter({ max: 3, windowMs: 60_000 }) });
	await insertCode(collection, 'cola', 'ABC123');
	const redeem = (code) => send({ host: 'cola.localhost', method: 'POST', path: '/api/redeem', body: { code } });

	assert.equal((await redeem('ABC123')).status, 200, 'successes do not count');
	for (let i = 0; i < 3; i++) assert.equal((await redeem(`WRONG${i}`)).status, 404);

	const blocked = await redeem('ABC123');
	assert.equal(blocked.status, 429);
	assert.deepEqual(blocked.json(), { error: 'too_many_attempts' });
});
