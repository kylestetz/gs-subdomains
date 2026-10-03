import assert from 'node:assert/strict';
import { test } from 'node:test';
import { convertLegacyCode } from '../scripts/migrate.js';

const at = (iso) => new Date(iso);

test('a used code', () => {
	const doc = convertLegacyCode({
		_id: '2WZZJ6',
		createdAt: at('2019-02-28'),
		accessedAt: [
			{ action: 'reset', time: at('2019-04-13') },
			{ action: 'use', time: at('2024-08-29T22:03:24Z') },
			{ action: 'attempt', time: at('2024-08-29T22:03:34Z') },
		],
		limit: 1,
		count: 1,
		attempts: 1,
	}, 'cola');

	assert.deepEqual(doc, {
		album: 'cola',
		code: '2WZZJ6',
		limit: 1,
		count: 1,
		permanent: false,
		redeemedAt: at('2024-08-29T22:03:24Z'),
		createdAt: at('2019-02-28'),
		accessedAt: [
			{ action: 'reset', time: at('2019-04-13') },
			{ action: 'use', time: at('2024-08-29T22:03:24Z') },
			{ action: 'attempt', time: at('2024-08-29T22:03:34Z') },
		],
	});
});

test('a code that was reset after being used is unused', () => {
	const doc = convertLegacyCode({
		_id: 'N23704',
		accessedAt: [
			{ action: 'use', time: at('2018-03-31T15:10:00Z') },
			{ action: 'reset', time: at('2018-03-31T15:25:00Z') },
			{ action: 'use', time: at('2018-03-31T15:30:00Z') },
			{ action: 'reset', time: at('2018-03-31T16:04:00Z') },
		],
		limit: 1,
		count: 0,
	}, 'pare');
	assert.equal(doc.count, 0);
	assert.equal(doc.redeemedAt, null);
});

test('Slack-created codes get their NaN count rebuilt from the log', () => {
	const used = convertLegacyCode({
		_id: 'A0F820',
		createdFrom: 'slack',
		accessedAt: [{ action: 'use', time: at('2019-06-26') }, { action: 'use', time: at('2019-06-27') }],
		limit: 1,
		count: NaN,
		attempts: NaN,
	}, 'slagroom');
	assert.equal(used.count, 2);
	assert.deepEqual(used.redeemedAt, at('2019-06-27'));
	assert.equal(used.createdFrom, 'slack');

	const unused = convertLegacyCode({ _id: 'a0a0a0', createdFrom: 'slack', accessedAt: [], limit: 1 }, 'cola');
	assert.equal(unused.count, 0);
	assert.equal(unused.code, 'A0A0A0', 'lower-case codes are upper-cased so they can be redeemed');
});

test('numeric codes become strings', () => {
	assert.equal(convertLegacyCode({ _id: 623585, accessedAt: [], limit: 1, count: 0 }, 'fossilillies').code, '623585');
});

test('permanent codes stay permanent', () => {
	const doc = convertLegacyCode({ _id: 'GSBLOOD', permanent: true, accessedAt: [], limit: 1, count: 13 }, 'slagroom');
	assert.equal(doc.permanent, true);
	assert.equal(doc.count, 13);
});
