import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createCodes } from '../server/codes.js';
import { connectTestDb, insertCode, HOUR } from './helpers.js';

const actions = (doc) => doc.accessedAt.map((entry) => entry.action);

test('redeem', async (t) => {
	const collection = await connectTestDb(t);
	const codes = createCodes(collection, { windowMs: 24 * HOUR });
	const start = new Date('2026-01-01T00:00:00Z');
	const later = (hours) => new Date(start.getTime() + hours * HOUR);
	const find = (code) => collection.findOne({ album: 'cola', code });

	await t.test('unknown codes do not exist', async () => {
		assert.equal(await codes.redeem('cola', 'NOPE00', start), 'does_not_exist');
		assert.equal(await codes.redeem('cola', '', start), 'does_not_exist');
		assert.equal(await codes.redeem('cola', undefined, start), 'does_not_exist');
		assert.equal(await collection.countDocuments(), 0);
	});

	await t.test('using a code opens a download window', async () => {
		await insertCode(collection, 'cola', 'ABC123');

		assert.equal(await codes.redeem('cola', ' abc123 ', start), 'ok');
		let doc = await find('ABC123');
		assert.equal(doc.count, 1);
		assert.deepEqual(doc.redeemedAt, start);

		assert.equal(await codes.redeem('cola', 'ABC123', later(1)), 'ok');
		assert.equal(await codes.redeem('cola', 'ABC123', later(23)), 'ok');
		doc = await find('ABC123');
		assert.equal(doc.count, 1, 'downloads inside the window do not use up redemptions');
		assert.deepEqual(actions(doc), ['use', 'download', 'download']);

		assert.equal(await codes.redeem('cola', 'ABC123', later(25)), 'expired');
		assert.deepEqual(actions(await find('ABC123')), ['use', 'download', 'download', 'attempt']);
	});

	await t.test('codes belong to one album', async () => {
		await insertCode(collection, 'cola', 'SHARED');
		await insertCode(collection, 'pare', 'SHARED');
		assert.equal(await codes.redeem('cola', 'SHARED', start), 'ok');
		assert.equal(await codes.redeem('mirage', 'SHARED', start), 'does_not_exist');
		assert.equal((await collection.findOne({ album: 'pare', code: 'SHARED' })).count, 0);
	});

	await t.test('limit allows several separate redemptions', async () => {
		await insertCode(collection, 'cola', 'TWICE1', { limit: 2 });
		assert.equal(await codes.redeem('cola', 'TWICE1', start), 'ok');
		assert.equal(await codes.redeem('cola', 'TWICE1', later(30)), 'ok');
		assert.equal(await codes.redeem('cola', 'TWICE1', later(40)), 'ok', 'still inside the second window');
		assert.equal(await codes.redeem('cola', 'TWICE1', later(60)), 'expired');
		assert.equal((await find('TWICE1')).count, 2);
	});

	await t.test('permanent codes never run out', async () => {
		await insertCode(collection, 'cola', 'GSBLOOD', { permanent: true, count: 13 });
		assert.equal(await codes.redeem('cola', 'GSBLOOD', start), 'ok');
		assert.equal(await codes.redeem('cola', 'GSBLOOD', later(1000)), 'ok');
		assert.equal((await find('GSBLOOD')).count, 15);
	});

	await t.test('check never writes', async () => {
		await insertCode(collection, 'cola', 'PEEK01');
		assert.equal(await codes.check('cola', 'peek01', start), 'ok');
		assert.equal(await codes.check('cola', 'NOPE00', start), 'does_not_exist');
		assert.deepEqual(actions(await find('PEEK01')), []);

		await codes.redeem('cola', 'PEEK01', start);
		assert.equal(await codes.check('cola', 'PEEK01', later(1)), 'ok');
		assert.equal(await codes.check('cola', 'PEEK01', later(25)), 'expired');
		assert.deepEqual(actions(await find('PEEK01')), ['use']);
	});

	await t.test('the log is capped', async () => {
		await insertCode(collection, 'cola', 'NOISY1', { count: 1 });
		for (let i = 0; i < 105; i++) await codes.redeem('cola', 'NOISY1', start);
		assert.equal((await find('NOISY1')).accessedAt.length, 100);
	});
});

test('a zero-length window makes codes strictly single-use', async (t) => {
	const collection = await connectTestDb(t);
	const codes = createCodes(collection, { windowMs: 0 });
	await insertCode(collection, 'cola', 'ONCE01');
	assert.equal(await codes.redeem('cola', 'ONCE01'), 'ok');
	assert.equal(await codes.redeem('cola', 'ONCE01'), 'expired');
});
