import { access, constants, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { compileAsync } from 'sass';
import { format } from 'oxfmt';
import oxfmtConfig from './.oxfmtrc.json' with { type: 'json' };

buildAll([
	['preset/remarkdown.scss', 'dist'],
	['preset/remarkdown-attr.scss', 'dist'],
	['preset/remarkdown-zero.scss', 'dist'],
	['preset/remarkdown-zero-attr.scss', 'dist'],
	['docs/docs.scss', 'docs'],
]);

async function buildAll(sources) {
	const results = await Promise.all(
		sources.map(([input, outDir]) => {
			const out = join(outDir, basename(input, '.scss') + '.css');
			return buildStylesheet(input, out);
		}),
	);
	console.table(results.filter(Boolean), ['input', 'out', 'size']);
}

async function buildStylesheet(inputFilename, outFilename) {
	const inputFile = join(import.meta.dirname, inputFilename);
	const outFile = join(import.meta.dirname, outFilename);

	try {
		await access(inputFile, constants.R_OK);
	} catch {
		console.error(`Missing file ${inputFile}`);
		return { input: inputFilename, out: null, size: null };
	}

	const { css } = await compileAsync(inputFile);
	const { code } = await format(basename(outFile), css, oxfmtConfig);
	await writeFile(outFile, code);

	return {
		input: inputFilename,
		out: outFilename,
		size: code.length + ' B',
	};
}
