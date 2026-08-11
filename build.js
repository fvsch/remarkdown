import { access, constants, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { compileAsync } from 'sass';
import { format } from 'oxfmt';
import oxfmtConfig from './.oxfmtrc.json' with { type: 'json' };

buildAll([
	['preset/remarkdown.scss', 'dist/remarkdown.css'],
	['preset/remarkdown.attr.scss', 'dist/remarkdown.attr.css'],
	['preset/remarkdown.scope.scss', 'dist/remarkdown.scope.css'],
	['preset/remarkdown-zero.scss', 'dist/remarkdown-zero.css'],
	['preset/remarkdown-zero.attr.scss', 'dist/remarkdown-zero.attr.css'],
	['preset/remarkdown-zero.scope.scss', 'dist/remarkdown-zero.scope.css'],
	['docs/demo.scss', 'docs/demo.css'],
]);

async function buildAll(sources) {
	const results = await Promise.all(sources.map(([input, out]) => buildStylesheet(input, out)));
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
