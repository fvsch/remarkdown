import { describe, expect, test } from 'vitest';

import { getCssVars, getSelectors, scss } from './shared';

describe('rmd.styles()', () => {
	test('outputs default stylesheet', () => {
		const { css, logs } = scss`
			@include rmd.styles();
		`;
		expect(logs).toStrictEqual([]);

		// Check output
		expect(css.length).toBeGreaterThan(8_000);
		expect(css.length).toBeLessThan(12_000);
		expect(css).toMatch(`--rmd-base-font: ui-monospace, monospace;`);

		// Check a few selectors are present
		const selectors = getSelectors(css);
		expect(selectors.length).toBeGreaterThan(70);
		expect(selectors).toContain('.remarkdown');
		expect(selectors).toContain('.remarkdown p');
		expect(selectors).toContain('.remarkdown.h1-line h1');
	});

	test('config can customize output', () => {
		const { css, logs } = scss`
			@include rmd.config(
				$base-selector: ":root",
				$default-selector: "",
				$option-selector: ".%s",
				$css-vars: "--%s",
				$hn-prefix: "!",
				$base-font: (Iosevka, monospace)
			);
			@include rmd.styles();
		`;
		expect(logs).toStrictEqual([]);

		// Check output length
		expect(css.length).toBeGreaterThan(8_000);
		expect(css.length).toBeLessThan(12_000);

		// Check that configured CSS variable syntax/values are present
		const vars = getCssVars(css);
		expect(vars).toContain(`--hn-prefix: "!"`);
		expect(vars).toContain(`--base-font: Iosevka, monospace`);

		// Check a few selectors are present
		const selectors = getSelectors(css);
		expect(selectors.length).toBeGreaterThan(70);
		expect(selectors).toContain(':root');
		expect(selectors).toContain('p');
		expect(selectors).toContain('.h1-line h1');
	});

	test('disable all styles', () => {
		const { css, logs } = scss`
			@include rmd.config(
				$default-styles: (),
				$optional-styles: (),
			);
			@include rmd.styles();
		`;
		expect(logs).toStrictEqual([]);

		// Check output length
		// We currently output a dozen rules, maybe it should be lower…
		expect(css.length).toBeGreaterThan(1_000);
		expect(css.length).toBeLessThan(2_000);

		// Check against a snapshot of expected selectors
		// This could change if some of the style implementations are fixed,
		// for example to not reset UL/OL margins and list-style-type if
		// all `ul-*` and/or `ol-*` styles are disabled
		const selectors = getSelectors(css);
		expect(selectors).toStrictEqual([
			'.remarkdown',
			'.remarkdown p',
			'.remarkdown figure',
			'.remarkdown ul',
			'.remarkdown li ul',
			'.remarkdown ol',
			'.remarkdown li ol',
			'.remarkdown ol > li',
			'.remarkdown pre',
			'.remarkdown blockquote',
			'.remarkdown hr',
		]);
	});
});
