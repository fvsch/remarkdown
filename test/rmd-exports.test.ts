import { describe, expect, test } from 'vitest';

import { findOutput, scss } from './helpers';

const RMD_MIXINS = [
	'config',
	'header',
	'styles',
	'styles-base',
	'styles-code',
	'styles-del',
	'styles-em',
	'styles-figure',
	'styles-heading',
	'styles-hr',
	'styles-link',
	'styles-ol',
	'styles-p',
	'styles-pre',
	'styles-quote',
	'styles-strong',
	'styles-table',
	'styles-ul',
	'styles-vars',
];

const RMD_VARIABLES = ['url', 'version'];

describe('rmd namespace', () => {
	test('exports expected mixins', () => {
		const css = scss`
			$mixins: meta.module-mixins("rmd");
			@include test.array(map.keys($mixins));
		`;
		const mixins = findArray(css);
		expect(mixins.toSorted()).toEqual(RMD_MIXINS);
	});

	test('exports expected variables', () => {
		const css = scss`
			$vars: meta.module-variables("rmd");
			@include test.array(map.keys($vars));
		`;
		const vars = findArray(css);
		expect(vars.toSorted()).toEqual(RMD_VARIABLES);
	});

	test('exports no functions', () => {
		const css = scss`
			$fns: meta.module-functions("rmd");
			@include test.array(map.keys($fns));
		`;
		const vars = findArray(css);
		expect(vars.toSorted()).toEqual([]);
	});
});

function findArray(css: string): string[] {
	const output = findOutput(css, true);
	const data = JSON.parse(output!) as string[];
	expect(data).toBeInstanceOf(Array);
	return data;
}
