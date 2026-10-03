import http from 'node:http';
import { MongoClient } from 'mongodb';

export const HOUR = 60 * 60 * 1000;

export async function connectTestDb(t) {
	const client = new MongoClient(process.env.TEST_MONGO_URL || 'mongodb://127.0.0.1:27017/gs_codes_test');
	await client.connect();
	const collection = client.db().collection(`codes_${process.pid}_${Math.random().toString(36).slice(2)}`);
	t.after(async () => {
		await collection.drop().catch(() => {});
		await client.close();
	});
	return collection;
}

export function insertCode(collection, album, code, extra = {}) {
	return collection.insertOne({
		album,
		code,
		limit: 1,
		count: 0,
		permanent: false,
		redeemedAt: null,
		createdAt: new Date(),
		accessedAt: [],
		...extra,
	});
}

// fetch() can't set the Host header, which the app routes on.
export function request(port, { host, method = 'GET', path = '/', body, headers = {} }) {
	return new Promise((resolve, reject) => {
		const req = http.request({
			port,
			method,
			path,
			headers: {
				host: `${host}:${port}`,
				...(body && { 'content-type': 'application/json' }),
				...headers,
			},
		}, (res) => {
			const chunks = [];
			res.on('data', (chunk) => chunks.push(chunk));
			res.on('end', () => {
				const text = Buffer.concat(chunks).toString();
				resolve({
					status: res.statusCode,
					headers: res.headers,
					text,
					json: () => JSON.parse(text),
				});
			});
		});
		req.on('error', reject);
		req.end(body && JSON.stringify(body));
	});
}
