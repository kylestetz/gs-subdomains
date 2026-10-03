import { MongoClient } from 'mongodb';
import albums from '../albums.js';
import config from './config.js';
import { createApp } from './app.js';
import { createCodes } from './codes.js';

const client = new MongoClient(config.mongoUrl);
await client.connect();

const codes = createCodes(client.db().collection('codes'), { windowMs: config.downloadWindowMs });
await codes.ensureIndexes();

const app = createApp({
	codes,
	albums,
	sitesDir: config.sitesDir,
	downloadsDir: config.downloadsDir,
	trustProxy: config.trustProxy,
});

const server = app.listen(config.port, () => {
	console.log(`Serving ${albums.length} album sites on port ${config.port}`);
	console.log(`  e.g. http://${albums[0].id}.localhost:${config.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.once(signal, () => {
		server.close();
		client.close();
	});
}
