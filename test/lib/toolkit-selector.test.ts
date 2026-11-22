import { describe, expect, test } from 'vitest';

import { scssTemplate } from '../shared';

const scss = scssTemplate(`
	@use "./lib/config" as config;
	@use "./lib/toolkit/selector" as *;
`);

describe('default-selector()', () => {
	test('returns selector strings from config', () => {
		const { error, values } = scss`
			@include config.set(base-selector, ":root");
			@include config.set(default-selector, ".rmd");
			@debug capture(baseSelector, default-selector("base"));
			@debug capture(defaultSelector, default-selector("default"));
		`;
		expect(error).toBeUndefined();
		expect(values.baseSelector).toBe(':root');
		expect(values.defaultSelector).toBe('.rmd');
	});

	test('returns null for empty $default-selector', () => {
		const { error, values } = scss`
			@include config.set(default-selector, "");
			@debug capture(defaultSelector, default-selector("default"));
		`;
		expect(error).toBeUndefined();
		expect(values.defaultSelector).toBe(null);
	});
});

describe('option-selector()', () => {
	test('returns a list of selectors', () => {
		const { error, values } = scss`
			@include config.set(option-selector, ".remarkdown > .%s");
			@debug capture(selectors1, option-selector(hn-reset h1-line h2-line));

			@include config.set(option-selector, "#rmd %s");
			@debug capture(selectors2, option-selector(hn-reset h1-line h2-line));
		`;
		expect(error).toBeUndefined();
		expect(values.selectors1).toEqual([
			'.remarkdown > .hn-reset',
			'.remarkdown > .h1-line',
			'.remarkdown > .h2-line',
		]);
		expect(values.selectors2).toEqual(['#rmd hn-reset', '#rmd h1-line', '#rmd h2-line']);
	});

	test('errors on selector pattern containing comma', () => {
		const { error } = scss`
			@include config.set(option-selector, ".remarkdown.%s, .%s");
			@debug capture(selectors, option-selector(hn-reset h1-line h2-line));
		`;
		expect(error).toBeDefined();
		expect(error?.testMessage).toMatch(
			`Unsupported $option-selector pattern: '.remarkdown.%s, .%s'`,
		);
	});
});
