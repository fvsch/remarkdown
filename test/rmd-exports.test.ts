import { describe, expect, test } from 'vitest';

import { RMD_EXPORTS, RMD_CONFIG_EXPORTS, RMD_STYLES_EXPORTS } from './shared/data';
import { findOutput, scss } from './shared/helpers';

const namespaces = [
	{ name: 'rmd', ...RMD_EXPORTS },
	{ name: 'rmd-config', ...RMD_CONFIG_EXPORTS },
	{ name: 'rmd-styles', ...RMD_STYLES_EXPORTS },
];

for (const ns of namespaces) {
	describe(`${ns.name} namespace`, () => {
		test('exports expected functions', () => {
			const css = scss`
			$fns: meta.module-functions("${ns.name}");
			@include test.array(map.keys($fns));
		`;
			const vars = findArray(css);
			expect(vars.toSorted()).toEqual(ns.functions);
		});

		test('exports expected mixins', () => {
			const css = scss`
			$mixins: meta.module-mixins("${ns.name}");
			@include test.array(map.keys($mixins));
		`;
			const mixins = findArray(css);
			expect(mixins.toSorted()).toEqual(ns.mixins);
		});

		test('exports expected variables', () => {
			const css = scss`
			$vars: meta.module-variables("${ns.name}");
			@include test.array(map.keys($vars));
		`;
			const vars = findArray(css);
			expect(vars.toSorted()).toEqual(ns.variables);
		});
	});
}

function findArray(css: string): string[] {
	const output = (findOutput(css, true) ?? '').replace(/,\]$/, ']');
	const data = JSON.parse(output) as string[];
	expect(data).toBeInstanceOf(Array);
	return data;
}
