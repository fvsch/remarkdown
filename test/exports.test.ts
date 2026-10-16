import { describe, expect, test } from 'vitest';

import { CONFIG_EXPORTS, RMD_EXPORTS, STYLES_EXPORTS, scss, sortedKeys } from './shared';

const namespaces = [
	{ name: 'rmd', ...RMD_EXPORTS },
	{ name: 'config', ...CONFIG_EXPORTS },
	{ name: 'styles', ...STYLES_EXPORTS },
];

describe(`scss exports`, () => {
	for (const ns of namespaces) {
		test(`${ns.name} functions`, () => {
			const { values } = scss`
				$fns: meta.module-functions("${ns.name}");
				@debug capture(fns, map.keys($fns));
			`;
			expect(sortedKeys(values.fns)).toEqual(ns.functions);
		});

		test(`${ns.name} mixins`, () => {
			const { values } = scss`
				$mixins: meta.module-mixins("${ns.name}");
				@debug capture(mixins, map.keys($mixins));
			`;
			expect(sortedKeys(values.mixins)).toEqual(ns.mixins);
		});

		test(`${ns.name} variables`, () => {
			const { values } = scss`
				$vars: meta.module-variables("${ns.name}");
				@debug capture(vars, map.keys($vars));
			`;
			expect(sortedKeys(values.vars)).toEqual(ns.variables);
		});
	}
});
