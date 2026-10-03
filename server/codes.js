// Download code storage and redemption.
//
// All albums share one `codes` collection. A document looks like:
//
//   {
//     album: 'cola',              // albums.js id
//     code: 'ABC123',             // always stored upper-case
//     limit: 1,                   // how many times the code can be redeemed
//     count: 0,                   // how many times it has been redeemed
//     permanent: false,           // true = never runs out (promo/staff codes)
//     redeemedAt: Date | null,    // most recent redemption; opens the download window
//     createdAt: Date,
//     accessedAt: [{ action, time }],  // audit log: use | download | attempt | reset | create
//   }
//
// Redeeming a code that still has redemptions left uses one up and opens a
// download window. Any further request inside that window downloads again
// without using another redemption, so a flaky connection, a browser that fires
// the request twice, or a resumed download doesn't lock the buyer out.

export const LOG_LIMIT = 100;

export function normalizeCode(code) {
	return typeof code === 'string' ? code.trim().toUpperCase() : '';
}

function log(action, time) {
	return { accessedAt: { $each: [{ action, time }], $slice: -LOG_LIMIT } };
}

export function createCodes(collection, { windowMs }) {
	return {
		collection,

		ensureIndexes() {
			return collection.createIndex({ album: 1, code: 1 }, { unique: true });
		},

		// Read-only: what would happen if this code were redeemed right now?
		// Resolves to 'ok', 'expired' or 'does_not_exist'.
		async check(album, rawCode, now = new Date()) {
			const code = normalizeCode(rawCode);
			const doc = code && await collection.findOne({ album, code });
			if (!doc) return 'does_not_exist';
			if (doc.permanent || doc.count < doc.limit) return 'ok';
			if (doc.redeemedAt && now - doc.redeemedAt < windowMs) return 'ok';
			return 'expired';
		},

		// Redeem a code, recording the outcome in its log.
		// Resolves to 'ok', 'expired' or 'does_not_exist'.
		async redeem(album, rawCode, now = new Date()) {
			const code = normalizeCode(rawCode);
			if (!code) return 'does_not_exist';
			const filter = { album, code };

			// Still inside the download window from an earlier redemption.
			const again = await collection.updateOne(
				{ ...filter, permanent: { $ne: true }, redeemedAt: { $gt: new Date(now - windowMs) } },
				{ $push: log('download', now) },
			);
			if (again.matchedCount) return 'ok';

			// Permanent, or has redemptions left: use one up.
			const used = await collection.updateOne(
				{ ...filter, $or: [{ permanent: true }, { $expr: { $lt: ['$count', '$limit'] } }] },
				{ $inc: { count: 1 }, $set: { redeemedAt: now }, $push: log('use', now) },
			);
			if (used.matchedCount) return 'ok';

			const attempt = await collection.updateOne(filter, { $push: log('attempt', now) });
			return attempt.matchedCount ? 'expired' : 'does_not_exist';
		},
	};
}
