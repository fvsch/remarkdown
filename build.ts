import { access, constants, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { format } from 'oxfmt';
import postcss from 'postcss';
import dupSelectors from 'postcss-combine-duplicated-selectors';
import { compileAsync } from 'sass';

import oxfmtConfig from './.oxfmtrc.json' with { type: 'json' };

buildAll([
	{ input: 'preset/remarkdown.scss', dest: 'dist' },
	{ input: 'preset/remarkdown.attr.scss', dest: 'dist' },
	{ input: 'preset/remarkdown-zero.scss', dest: 'dist' },
	{ input: 'preset/remarkdown-zero.attr.scss', dest: 'dist' },
	{ input: 'docs/docs.scss', dest: 'docs' },
]);

async function buildAll(sources: { input: string; dest: string }[]) {
	const results = await Promise.all(
		sources.map(({ input, dest }) => {
			const out = join(dest, basename(input, '.scss') + '.css');
			return buildStylesheet(input, out);
		}),
	);
	console.table(results.filter(Boolean), ['input', 'out', 'size']);
}

async function buildStylesheet(inputFilename: string, outFilename: string) {
	const inputFile = join(import.meta.dirname, inputFilename);
	const outFile = join(import.meta.dirname, outFilename);

	try {
		await access(inputFile, constants.R_OK);
	} catch {
		console.error(`Missing file ${inputFile}`);
		return { input: inputFilename, out: null, size: null };
	}

	const sassed = await compileAsync(inputFile);
	const postcssed = await postcss([dupSelectors]).process(sassed.css, {
		from: outFilename,
		to: outFilename,
	});
	const formatted = await format(basename(outFile), postcssed.css, oxfmtConfig);
	await writeFile(outFile, formatted.code);

	return {
		input: inputFilename,
		out: outFilename,
		size: formatted.code.length + ' B',
	};
}
