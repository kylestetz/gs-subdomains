// Builds the JS bundles and stylesheets for the sites with their own front-end
// code (slagroom and safeword) from sites/<id>/src into sites/<id>/public.
// The other sites are plain static files and need no build.
//
//   npm run build            one-off build
//   npm run build -- --watch rebuild on change
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import * as esbuild from 'esbuild';
import less from 'less';

const sitesDir = path.resolve(import.meta.dirname, '../sites');

const sites = {
	slagroom: { scripts: ['site'] },
	safeword: { scripts: ['libs', 'site'] },
};

const { values } = parseArgs({ options: { watch: { type: 'boolean' } } });

async function buildCss(site) {
	const entry = path.join(sitesDir, site, 'src/css/style.less');
	const output = await less.render(await fs.readFile(entry, 'utf8'), { filename: entry });
	const dest = path.join(sitesDir, site, 'public/css/style.css');
	await fs.mkdir(path.dirname(dest), { recursive: true });
	await fs.writeFile(dest, output.css);
}

for (const [site, { scripts }] of Object.entries(sites)) {
	const context = await esbuild.context({
		entryPoints: scripts.map((name) => ({
			in: path.join(sitesDir, site, 'src/js', `${name}.js`),
			out: `${name}.min`,
		})),
		outdir: path.join(sitesDir, site, 'public/js/build'),
		bundle: true,
		minify: true,
		sourcemap: true,
		format: 'iife',
		target: 'es2020',
		logLevel: 'info',
	});

	await buildCss(site);
	console.log(`Built ${site}/public/css/style.css`);

	if (values.watch) {
		await context.watch();
		const lessDir = path.join(sitesDir, site, 'src/css');
		(async () => {
			for await (const _ of fs.watch(lessDir)) {
				await buildCss(site).then(
					() => console.log(`Rebuilt ${site}/public/css/style.css`),
					(err) => console.error(err.message),
				);
			}
		})();
	} else {
		await context.rebuild();
		await context.dispose();
	}
}
