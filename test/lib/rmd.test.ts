import { describe, expect, test } from 'vitest';

import {
	RMD_ALL_STYLES,
	RMD_CONFIG_KEYS,
	RMD_DEFAULT_STYLES,
	RMD_ZERO_DEFAULT_STYLES,
} from '../data';
import {
	expectScssExports,
	formatStringList,
	getHeader,
	getCssVars,
	getSelectors,
	expectSassError,
	pkg,
	scss,
	sortedKeys,
	type ScssResult,
} from '../shared';

describe('rmd namespace', () => {
	test('check exports', () => {
		expectScssExports('rmd', {
			functions: [],
			mixins: ['config', 'header', 'styles'],
			variables: [],
		});
	});
});

describe('rmd.config()', () => {
	test('calling with no value keeps defaults', () => {
		const { error, values } = scss`
			@include rmd.config();
			@debug capture(default, config.get(default-styles));
		`;
		expect(error).toBeUndefined();
		expect(sortedKeys(values.default)).toEqual(RMD_DEFAULT_STYLES);
	});

	test('using default preset keeps defaults', () => {
		const { error, values } = scss`
			@include rmd.config($preset: default);
			@debug capture(default, config.get(default-styles));
		`;
		expect(error).toBeUndefined();
		expect(sortedKeys(values.default)).toEqual(RMD_DEFAULT_STYLES);
	});

	test('can set Remarkdown-zero defaults', () => {
		const { error, values } = scss`
			@include rmd.config($preset: zero);
			@debug capture(default, config.get(default-styles));
			@debug capture(optional, config.get(optional-styles));
		`;
		expect(error).toBeUndefined();
		expect(sortedKeys(values.default)).toEqual(RMD_ZERO_DEFAULT_STYLES);
		expect(values.optional).toBe(true);
	});

	test('can set custom default-styles', () => {
		const { error, values } = scss`
			@include rmd.config($default-styles: (base-reset, hn-reset, em-reset, strong-reset));
			@debug capture(default, config.get(default-styles));
		`;
		expect(error).toBeUndefined();
		expect(values.default).toEqual(['base-reset', 'hn-reset', 'em-reset', 'strong-reset']);
	});

	test('can set custom options', () => {
		const { error, values } = scss`
			@include rmd.config($optional-styles: (ul-dash, hn-prefix));
			@debug capture(optional, config.get(optional-styles));
		`;
		expect(error).toBeUndefined();
		expect(values.optional).toEqual(['ul-dash', 'hn-prefix']);
	});

	test('$default-styles and $optional-styles accept a single string', () => {
		const { error, values } = scss`
			@include rmd.config($default-styles: base-reset, $optional-styles: h1-line);
			@debug capture(default, config.get(default-styles));
			@debug capture(optional, config.get(optional-styles));
		`;
		expect(error).toBeUndefined();
		expect(values.default).toEqual(['base-reset']);
		expect(values.optional).toEqual(['h1-line']);
	});

	test('accepts a config map instead of named params', () => {
		const { error, values } = scss`
			$config: (base-font: ("Consolas", monospace), line-height: 1.42);
			@include rmd.config($config);
			@debug capture(baseFont, config.get(base-font));
			@debug capture(lineHeight, config.get(line-height));
		`;
		expect(error).toBeUndefined();
		expect(values.baseFont).toEqual(['Consolas', 'monospace']);
		expect(values.lineHeight).toEqual(1.42);
	});

	test('can set any valid config value', () => {
		const expected: ScssResult['values'] = {
			'base-selector': ':root',
			'default-selector': '',
			'option-selector': '.%s',
			'css-vars': `--%s`,
			'base-font': ['Comic Sans Mono', 'monospace'],
			'code-font': ['Consolas', 'monospace'],
			'line-height': 2,
			'hn-prefix': `!`,
			'h1-line': `~~~~~~`,
			'h2-line': `^^^^^^`,
			'ul-dash': `_`,
			'ul-star': `$`,
			'ul-plus': `%`,
			'ol-mark': `)`,
			'pre-ticks': `'''`,
			'pre-tilde': `^^^`,
			'pre-tilde-line': `^__________^ `,
			'quote-mark': `|\n|\n|\n|\n|\n`,
			'quote-rtl': `|\n|\n|\n|\n|\n`,
			'hr-stars': `***`,
			'hr-dashes': `---`,
			'table-vline': `/\n/\n/\n/\n/\n/\n`,
			'table-hline': `-_-_-_-_-_-_`,
		};

		const { error, values } = scss`
			@include rmd.config(
				$base-selector: ":root",
				$default-selector: "",
				$option-selector: ".%s",
				$css-vars: "--%s",
				$base-font: ("Comic Sans Mono", monospace),
				$code-font: (Consolas, monospace),
				$line-height: 2,
				$hn-prefix: "!",
				$h1-line: "~~~~~~",
				$h2-line: "^^^^^^",
				$ul-dash: "_",
				$ul-star: "$",
				$ul-plus: "%",
				$ol-mark: ")",
				$pre-ticks: "'''",
				$pre-tilde: "^^^",
				$pre-tilde-line: "^__________^ ",
				$quote-mark: "|\\a|\\a|\\a|\\a|\\a",
				$quote-rtl: "|\\a|\\a|\\a|\\a|\\a",
				$hr-stars: "***",
				$hr-dashes: "---",
				$table-vline: "/\\a/\\a/\\a/\\a/\\a/\\a",
				$table-hline: "-_-_-_-_-_-_",
			);
			@each $key, $val in config.get-all() {
				@debug capture($key, $val);
			}
		`;

		expect(error).toBeUndefined();
		const counts = {
			values: Object.keys(values).length,
			expected: Object.keys(expected).length,
		};
		expect(counts.values).toBeGreaterThanOrEqual(counts.expected);

		for (const [name, expectedVal] of Object.entries(expected)) {
			const value = values[name];
			const assertion = expect(value, `config value for $${name}`);
			if (typeof expectedVal === 'object') {
				assertion.toEqual(expectedVal);
			} else {
				assertion.toBe(expectedVal);
			}
		}
	});

	test('unknown config keys are rejected', () => {
		const suffix = 'expected one of ' + formatStringList(RMD_CONFIG_KEYS);
		expectSassError(
			scss`@include rmd.config($font-family: "Comic Sans MS")`,
			`Unknown option $font-family, ${suffix}`,
		);
		expectSassError(
			scss`@include rmd.config((doesnt-exist: whoops))`,
			`Unknown option $doesnt-exist, ${suffix}`,
		);
	});

	test('rejects incorrect types', () => {
		expectSassError(
			scss`@include rmd.config($line-height: "150%")`,
			`$line-height's type must be "number", got: "string"`,
		);
		expectSassError(
			scss`@include rmd.config($base-font: false)`,
			`$base-font's type must be one of ("null", "string", "list"), got: "bool"`,
		);
	});

	test('rejects invalid default-styles/optional-styles', () => {
		const suffix = 'expected one of ' + formatStringList(RMD_ALL_STYLES);
		expectSassError(
			scss`@include rmd.config(
				$default-styles: (based, cool-cat, lolwhat)
			);`,
			`$default-styles has unknown style name "based", ${suffix}`,
		);
		expectSassError(
			scss`@include rmd.config(
				$optional-styles: (h1-line, "Hello!")
			);`,
			`$optional-styles has unknown style name "Hello!", ${suffix}`,
		);
	});

	test('accepts valid selectors', () => {
		const valid = [
			{ base: '.rmd', default: '.rmd', option: '.rmd--%s' },
			{ base: '.rmd', default: '.rmd', option: '.rmd--%s' },
			{ base: ':root', default: '', option: '.%s' },
			// invalid CSS selectors not caught by basic type/string validation
			{ base: '...', default: '{}', option: '!!%s' },
		];
		for (const selectors of valid) {
			const { values, error } = scss`
				@include rmd.config(
					$base-selector: "${selectors.base}",
					$default-selector: "${selectors.default}",
					$option-selector: "${selectors.option}"
				);
				@debug capture(base, config.get(base-selector));
				@debug capture(default, config.get(default-selector));
				@debug capture(option, config.get(option-selector));
			`;
			expect(error).toBeUndefined();
			expect(values).toEqual(selectors);
		}
	});

	test('rejects invalid selectors', () => {
		expectSassError(
			scss`@include rmd.config($base-selector: "")`,
			`$base-selector cannot be an empty string`,
		);
		expectSassError(
			scss`@include rmd.config($option-selector: "")`,
			`$option-selector cannot be an empty string`,
		);
		expectSassError(
			scss`@include rmd.config($option-selector: ".rmd")`,
			`$option-selector must contain the substring "%s", got ".rmd"`,
		);
	});

	test('setting $default-styles impacts optional styles', () => {
		const { values, error } = scss`
			@include rmd.config(
				$preset: default,
				$default-styles: (base-reset, hn-reset),
				$optional-styles: true,
			);
			@debug capture(default, config.get(default-styles));
			@debug capture(has-hn-prefix, config.has-option(hn-prefix));
		`;

		expect(error).toBeUndefined();
		expect(values).toEqual({
			default: ['base-reset', 'hn-reset'],
			'has-hn-prefix': true,
		});
	});
});

describe('rmd.header()', () => {
	test('outputs correct package version', () => {
		const { css, error } = scss`
			@include rmd.header();
		`;
		expect(error).toBeUndefined();
		expect(getHeader(css).title).toMatch(`Remarkdown ${pkg.version}`);
	});

	test('custom $title', () => {
		const { css, error } = scss`
			@include rmd.header($title: "[Remarkdown](%u)");
		`;
		expect(error).toBeUndefined();
		expect(getHeader(css).title).toBe(`[Remarkdown](${pkg.homepage})`);
	});

	test('outputs list of default styles', () => {
		const { css, error } = scss`
			@include rmd.header();
		`;
		expect(error).toBeUndefined();
		expect(getHeader(css).defaults).toEqual(RMD_DEFAULT_STYLES);
	});

	test('reflects changes to $default-styles', () => {
		const customDefaults = ['base-reset', 'h1-line', 'hn-reset', 'pre-tick'];
		const { css, error } = scss`
			@include rmd.config($default-styles: (${customDefaults.join(', ')}));
			@include rmd.header();
		`;
		expect(error).toBeUndefined();
		expect(getHeader(css).defaults).toEqual(customDefaults);
	});
});

describe('rmd.styles()', () => {
	test('outputs default stylesheet', () => {
		const { css, error } = scss`
			@include rmd.styles();
		`;
		expect(error).toBeUndefined();

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
		const { css, error } = scss`
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
		expect(error).toBeUndefined();

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
		const { css, error } = scss`
			@include rmd.config(
				$default-styles: (),
				$optional-styles: (),
			);
			@include rmd.styles();
		`;
		expect(error).toBeUndefined();

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
