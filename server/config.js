import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

export default {
	port: Number(process.env.PORT || 3000),
	mongoUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/gs_codes',
	downloadsDir: path.resolve(root, process.env.DOWNLOADS_DIR || 'downloads'),
	sitesDir: path.join(root, 'sites'),
	// How long a redeemed code keeps working for repeat/resumed downloads.
	// 0 makes every code strictly single-use, like the old promocodes app.
	downloadWindowMs: Number(process.env.DOWNLOAD_WINDOW_HOURS ?? 24) * 60 * 60 * 1000,
	// nginx internal location that serves DOWNLOADS_DIR, e.g. /_downloads/.
	// When set, the app checks the code and nginx sends the file.
	accelRedirect: process.env.ACCEL_REDIRECT || null,
	// Express "trust proxy" setting; loopback suits nginx on the same machine.
	trustProxy: process.env.TRUST_PROXY || 'loopback',
};
