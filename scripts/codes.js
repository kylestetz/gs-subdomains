// Code admin, replacing the old promocodes/Slack tooling.
//
//   npm run codes -- stats
//   npm run codes -- info <album> <code>
//   npm run codes -- reset <album> <code>
//   npm run codes -- add <album> <code> [--limit 1] [--permanent]
//   npm run codes -- generate <album> <how many> [--length 6] > codes.txt
//   npm run codes -- export <album> > codes.csv
import crypto from 'node:crypto';
import { parseArgs } from 'node:util';
import { MongoClient } from 'mongodb';
import albums from '../albums.js';
import { createCodes, normalizeCode } from '../server/codes.js';

// No 0/O, 1/I/L: these get printed on cards and typed in by hand.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

const { positionals, values } = parseArgs({
	allowPositionals: true,
	options: {
		limit: { type: 'string', default: '1' },
		permanent: { type: 'boolean', default: false },
		length: { type: 'string', default: '6' },
	},
});
const [command, albumId, arg] = positionals;

function fail(message) {
	console.error(message);
	process.exit(1);
}

if (command !== 'stats') {
	if (!albums.some((album) => album.id === albumId)) {
		fail(`Unknown album "${albumId ?? ''}". Albums: ${albums.map((album) => album.id).join(', ')}`);
	}
	if (!arg && command !== 'export') fail(`Missing ${command === 'generate' ? 'number of codes' : 'code'}.`);
}

const client = new MongoClient(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/gs_codes');
await client.connect();
const collection = client.db().collection('codes');
const now = new Date();

try {
	switch (command) {
		case 'stats': {
			const rows = await collection.aggregate([
				{ $group: {
					_id: '$album',
					codes: { $sum: 1 },
					usedUp: { $sum: { $cond: [{ $and: [{ $ne: ['$permanent', true] }, { $gte: ['$count', '$limit'] }] }, 1, 0] } },
					lastUse: { $max: '$redeemedAt' },
				} },
				{ $sort: { _id: 1 } },
			]).toArray();
			console.table(Object.fromEntries(rows.map(({ _id, ...row }) => [_id, row])));
			break;
		}

		case 'info': {
			const doc = await collection.findOne({ album: albumId, code: normalizeCode(arg) }, { projection: { _id: 0 } });
			if (!doc) fail('No such code.');
			console.dir(doc, { depth: null });
			break;
		}

		case 'reset': {
			const result = await collection.updateOne(
				{ album: albumId, code: normalizeCode(arg) },
				{ $set: { count: 0, redeemedAt: null }, $push: { accessedAt: { action: 'reset', time: now } } },
			);
			if (!result.matchedCount) fail('No such code.');
			console.log(`Reset ${normalizeCode(arg)}.`);
			break;
		}

		case 'add': {
			await createCodes(collection, { windowMs: 0 }).ensureIndexes();
			await collection.insertOne(newCode(albumId, normalizeCode(arg)));
			console.log(`Added ${normalizeCode(arg)} to ${albumId}.`);
			break;
		}

		case 'generate': {
			const wanted = Number(arg);
			const length = Number(values.length);
			if (!Number.isInteger(wanted) || wanted < 1) fail('Number of codes must be a positive integer.');
			await createCodes(collection, { windowMs: 0 }).ensureIndexes();

			const created = [];
			while (created.length < wanted) {
				const batch = Array.from({ length: wanted - created.length }, () => newCode(albumId, randomCode(length)));
				try {
					await collection.insertMany(batch, { ordered: false });
					created.push(...batch);
				} catch (err) {
					// Collisions with existing codes fail individually; keep the rest and go again.
					if (err.code !== 11000) throw err;
					const failed = new Set(err.writeErrors.map((writeError) => writeError.index));
					created.push(...batch.filter((_, i) => !failed.has(i)));
				}
			}
			for (const doc of created) console.log(doc.code);
			console.error(`Generated ${created.length} codes for ${albumId}.`);
			break;
		}

		case 'export': {
			console.log('code,count,limit,permanent,redeemedAt');
			const cursor = collection.find({ album: albumId }).sort({ code: 1 });
			for await (const doc of cursor) {
				console.log([doc.code, doc.count, doc.limit, doc.permanent, doc.redeemedAt?.toISOString() ?? ''].join(','));
			}
			break;
		}

		default:
			fail('Usage: npm run codes -- <stats | info | reset | add | generate | export> …  (see scripts/codes.js)');
	}
} finally {
	await client.close();
}

function newCode(album, code) {
	return {
		album,
		code,
		limit: Number(values.limit),
		count: 0,
		permanent: values.permanent,
		redeemedAt: null,
		createdAt: now,
		accessedAt: [{ action: 'create', time: now }],
	};
}

function randomCode(length) {
	return Array.from({ length }, () => ALPHABET[crypto.randomInt(ALPHABET.length)]).join('');
}
