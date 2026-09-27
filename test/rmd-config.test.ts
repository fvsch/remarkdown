import { describe, expect, test } from 'vitest';

import { RMD_DEFAULTS, RMD_ZERO_DEFAULTS } from './shared/data';
import { findDefaults, scss } from './shared/helpers';

describe('rmd.config', () => {
	test('calling with no value keeps defaults', () => {
		const css = scss`
			@include rmd.config();
			@include rmd.header();
		`;
		const defaults = findDefaults(css, true);
		expect(defaults).toEqual(RMD_DEFAULTS);
	});

	test('using default preset keeps defaults', () => {
		const css = scss`
			@include rmd.config($preset: default);
			@include rmd.header();
		`;
		const defaults = findDefaults(css, true);
		expect(defaults).toEqual(RMD_DEFAULTS);
	});

	test('can set Remarkdown-zero defaults', () => {
		const css = scss`
			@include rmd.config($preset: zero);
			@include rmd.header();
		`;
		const defaults = findDefaults(css, true);
		expect(defaults).toEqual(RMD_ZERO_DEFAULTS);
	});
});
