import { describe, expect, test } from 'vitest';

import { RMD_DEFAULT_STYLES, findHeader, pkg, scss } from './shared';

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
		expect(defaults).toEqual(RMD_DEFAULT_STYLES);
	});

	test('reflects changes to $default-styles', () => {
		const customDefaults = ['font-reset', 'h1-line', 'hn-reset', 'pre-tick'];
		const { css } = scss`
			@include rmd.config($default-styles: (${customDefaults.join(', ')}));
			@include rmd.header();
		`;
		const { defaults } = findHeader(css);
		expect(defaults).toEqual(customDefaults);
	});
});
