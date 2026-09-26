import { describe, expect, test } from 'vitest';

import { RMD_STYLE_DEFAULTS } from './constants';
import { findDefaults, findHeader, pkg, scss } from './helpers';

describe('rmd.header', () => {
	test('outputs correct package version', () => {
		const css = scss`
			@include rmd.header();
		`;
		const header = findHeader(css, true);
		expect(header).toMatch(`Remarkdown ${pkg.version}`);
	});

	test('custom $title', () => {
		const css = scss`
			@include rmd.header($title: "[Remarkdown](%u)");
		`;
		const header = findHeader(css, true);
		expect(header).toBe(`[Remarkdown](${pkg.homepage})`);
	});

	test('outputs list of default styles', () => {
		const css = scss`
			@include rmd.header();
		`;
		const defaults = findDefaults(css, true);
		expect(defaults).toEqual(RMD_STYLE_DEFAULTS);
	});

	test('reflects changes to $defaults', () => {
		const customDefaults = ['base-text', 'h1-line', 'hn-reset', 'pre-tick'];
		const css = scss`
			@include rmd.config($defaults: (${customDefaults.join(', ')}));
			@include rmd.header();
		`;
		const defaults = findDefaults(css, true);
		expect(defaults).toEqual(customDefaults);
	});
});
