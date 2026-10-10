import { describe, expect, test } from 'vitest';

import { RMD_DEFAULTS, findHeader, pkg, scss } from './shared';

describe('rmd.header()', () => {
	test('outputs correct package version', () => {
		const { css } = scss`
			@include rmd.header();
		`;
		const { title } = findHeader(css);
		expect(title).toMatch(`Remarkdown ${pkg.version}`);
	});

	test('custom $title', () => {
		const { css } = scss`
			@include rmd.header($title: "[Remarkdown](%u)");
		`;
		const { title } = findHeader(css);
		expect(title).toBe(`[Remarkdown](${pkg.homepage})`);
	});

	test('outputs list of default styles', () => {
		const { css } = scss`
			@include rmd.header();
		`;
		const { defaults } = findHeader(css);
		expect(defaults).toEqual(RMD_DEFAULTS);
	});

	test('reflects changes to $defaults', () => {
		const customDefaults = ['base-text', 'h1-line', 'hn-reset', 'pre-tick'];
		const { css } = scss`
			@include rmd.config($defaults: (${customDefaults.join(', ')}));
			@include rmd.header();
		`;
		const { defaults } = findHeader(css);
		expect(defaults).toEqual(customDefaults);
	});
});
