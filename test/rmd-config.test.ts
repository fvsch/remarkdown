import { describe, expect, test } from 'vitest';

import { RMD_STYLE_DEFAULTS, RMD_STYLE_ZERO } from './constants';
import { findDefaults, scss } from './helpers';

describe('rmd.config', () => {
	test('calling with no value keeps defaults', () => {
		const css = scss`
			@include rmd.config();
			@include rmd.header();
		`;
		const defaults = findDefaults(css, true);
		expect(defaults).toEqual(RMD_STYLE_DEFAULTS);
	});

	test('can set Remarkdown-zero defaults', () => {
		const css = scss`
			@include rmd.config($preset: zero);
			@include rmd.header();
		`;
		const defaults = findDefaults(css, true);
		expect(defaults).toEqual(RMD_STYLE_ZERO);
	});
});
