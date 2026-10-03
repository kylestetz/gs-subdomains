// Imports codes from the old per-album promocodes databases into the single
// `codes` collection, reading straight from a `mongodump` directory:
//
//   npm run migrate -- <dump dir> [--drop]
//
// <dump dir> is the folder holding one subfolder per database (cola/,
// nina_keith/, …). Refuses to touch a non-empty collection unless --drop is
// given, so it can't clobber redemptions made after cutover by accident.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { BSON, MongoClient } from 'mongodb';
import albums from '../albums.js';
import { createCodes, normalizeCode, LOG_LIMIT } from '../server/codes.js';

// Maps a promocodes document onto the new schema.
//
// promocodes quirks this smooths over:
// - A few codes were inserted with numeric or lower-case _ids. The old app
//   looked codes up as upper-case strings, so those could never be redeemed.
// - Codes created from Slack have no count, and promocodes' `count + 1` turned
//   it into NaN, so they never expired. Their count is rebuilt from the log.
// - "reset" log entries mark an admin setting count back to 0.
export function convertLegacyCode(doc, album) {
	const log = (doc.accessedAt ?? []).map(({ action, time }) => ({ action, time }));
	const lastReset = log.findLastIndex((entry) => entry.action === 'reset');
	const usesSinceReset = log.slice(lastReset + 1).filter((entry) => entry.action === 'use');

	const converted = {
		album,
		code: normalizeCode(String(doc._id)),
		limit: Number.isFinite(doc.limit) ? doc.limit : 1,
		count: Number.isFinite(doc.count) ? doc.count : usesSinceReset.length,
		permanent: doc.permanent === true,
		redeemedAt: usesSinceReset.at(-1)?.time ?? null,
		createdAt: doc.createdAt ?? null,
		accessedAt: log.slice(-LOG_LIMIT),
	};
	if (converted.count === 0) converted.redeemedAt = null;
	if (doc.createdFrom) converted.createdFrom = doc.createdFrom;
	return converted;
}

export function* readBsonFile(file) {
	const buffer = fs.readFileSync(file);
	let offset = 0;
	while (offset < buffer.length) {
		const size = buffer.readInt32LE(offset);
		yield BSON.deserialize(buffer.subarray(offset, offset + size));
		offset += size;
	}
}

export function loadDump(dumpDir) {
	const docs = [];
	const skipped = [];
	for (const album of albums) {
		const file = path.join(dumpDir, album.legacyDb, 'codes.bson');
		if (!fs.existsSync(file)) throw new Error(`No codes for ${album.id} at ${file}`);

		const seen = new Set();
		for (const legacy of readBsonFile(file)) {
			const doc = convertLegacyCode(legacy, album.id);
			if (!doc.code || seen.has(doc.code)) {
				skipped.push({ album: album.id, _id: legacy._id, reason: doc.code ? 'duplicate' : 'empty code' });
				continue;
			}
			seen.add(doc.code);
			docs.push(doc);
		}
	}
	return { docs, skipped };
}

if (import.meta.main) {
	const { positionals, values } = parseArgs({ allowPositionals: true, options: { drop: { type: 'boolean' } } });
	const [dumpDir] = positionals;
	if (!dumpDir) {
		console.error('Usage: npm run migrate -- <mongodump dir> [--drop]');
		process.exit(1);
	}

	const { docs, skipped } = loadDump(dumpDir);
	for (const skip of skipped) console.warn(`Skipping ${skip.album} code ${skip._id}: ${skip.reason}`);

	const client = new MongoClient(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/gs_codes');
	await client.connect();
	try {
		const collection = client.db().collection('codes');
		const existing = await collection.estimatedDocumentCount();
		if (existing && !values.drop) {
			console.error(`${collection.namespace} already has ${existing} codes. Re-run with --drop to replace them.`);
			process.exitCode = 1;
		} else {
			if (existing) await collection.drop();
			await createCodes(collection, { windowMs: 0 }).ensureIndexes();
			await collection.insertMany(docs);

			console.log(`Imported ${docs.length} codes into ${collection.namespace}:`);
			for (const album of albums) {
				const mine = docs.filter((doc) => doc.album === album.id);
				const used = mine.filter((doc) => !doc.permanent && doc.count >= doc.limit).length;
				console.log(`  ${album.id.padEnd(16)} ${String(mine.length).padStart(5)} codes, ${used} used up`);
			}
		}
	} finally {
		await client.close();
	}
}
