import { describe, expect, test } from 'vitest';

import {
	RMD_ALL_STYLES,
	RMD_CONFIG_KEYS,
	RMD_DEFAULT_STYLES,
	RMD_ZERO_DEFAULT_STYLES,
	scss,
	sortedKeys,
	type ScssResult,
} from './shared';

describe('rmd.config()', () => {
	test('calling with no value keeps defaults', () => {
		const { values } = scss`
			@include rmd.config();
			@debug capture(default, config.get(default-styles));
		`;
		expect(sortedKeys(values.default)).toEqual(RMD_DEFAULT_STYLES);
	});

	test('using default preset keeps defaults', () => {
		const { values } = scss`
			@include rmd.config($preset: default);
			@debug capture(default, config.get(default-styles));
		`;
		expect(sortedKeys(values.default)).toEqual(RMD_DEFAULT_STYLES);
	});

	test('can set Remarkdown-zero defaults', () => {
		const { values } = scss`
			@include rmd.config($preset: zero);
			@debug capture(default, config.get(default-styles));
			@debug capture(optional, config.get(optional-styles));
		`;
		expect(sortedKeys(values.default)).toEqual(RMD_ZERO_DEFAULT_STYLES);
		expect(values.optional).toBe(true);
	});

	test('can set custom default-styles', () => {
		const { values } = scss`
			@include rmd.config($default-styles: (base-reset, hn-reset, em-reset, strong-reset));
			@debug capture(default, config.get(default-styles));
		`;
		expect(values.default).toEqual(['base-reset', 'hn-reset', 'em-reset', 'strong-reset']);
	});

	test('can set custom options', () => {
		const { values } = scss`
			@include rmd.config($optional-styles: (ul-dash, hn-prefix));
			@debug capture(optional, config.get(optional-styles));
		`;
		expect(values.optional).toEqual(['ul-dash', 'hn-prefix']);
	});

	test('$default-styles and $optional-styles accept a single string', () => {
		const { values } = scss`
			@include rmd.config($default-styles: base-reset, $optional-styles: h1-line);
			@debug capture(default, config.get(default-styles));
			@debug capture(optional, config.get(optional-styles));
		`;
		expect(values.default).toEqual(['base-reset']);
		expect(values.optional).toEqual(['h1-line']);
	});

	test('accepts a config map instead of named params', () => {
		const { values } = scss`
			$config: (base-font: ("Consolas", monospace), line-height: 1.42);
			@include rmd.config($config);
			@debug capture(baseFont, config.get(base-font));
			@debug capture(lineHeight, config.get(line-height));
		`;
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

		const { values, logs } = scss`
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
			@each $key, $val in config.get() {
				@debug capture($key, $val);
			}
		`;

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

	test('margins for undefined elements use defaults', () => {
		const defaultMargins = { top: '1lh', bottom: '1lh' };
		const { values } = scss`
			@debug capture(default, config.get-margins(default));
			@debug capture(unicorn, config.get-margins(unicorn));
		`;
		expect(sortedKeys(values)).toEqual(['default', 'unicorn']);
		expect(values.default).toEqual(defaultMargins);
		expect(values.unicorn).toEqual(defaultMargins);
	});

	test('custom margins have default top/bottom', () => {
		const { values } = scss`
			// set custom margins for h1 and h2 only
			@include rmd.config(
				$margins: (
					h1: (top: 3lh, bottom: 20px),
					h2: (top: 2vh),
				)
			);

			// print out margins for h1 and a few other elements
			@each $el in (default, h1, h2, ol, table) {
				@debug capture($el, config.get-margins($el));
			}
		`;

		const defaultMargins = { top: '1lh', bottom: '1lh' };
		const expected: ScssResult['values'] = {
			default: defaultMargins,
			h1: { top: '3lh', bottom: '20px' },
			h2: { top: '2vh', bottom: '1lh' },
			ol: { top: '1lh', bottom: '1lh' },
			table: { top: '1lh', bottom: '1lh' },
		};

		expect(sortedKeys(values)).toEqual(sortedKeys(expected));

		for (const [el, expectedVal] of Object.entries(expected)) {
			expect(values[el], `margins for ${el}`).toEqual(expectedVal);
		}
	});

	test('unknown config keys are rejected', () => {
		const suffix = 'expected one of ' + formatList(RMD_CONFIG_KEYS);
		expectSassError(
			`@include rmd.config($font-family: "Comic Sans MS")`,
			`Unknown option $font-family, ${suffix}`,
		);
		expectSassError(
			`@include rmd.config((doesnt-exist: whoops))`,
			`Unknown option $doesnt-exist, ${suffix}`,
		);
	});

	test('rejects incorrect types', () => {
		expectSassError(
			`@include rmd.config($line-height: "150%")`,
			`$line-height's type must be "number", got: "string"`,
		);
		expectSassError(
			`@include rmd.config($base-font: false)`,
			`$base-font's type must be one of ("null", "string", "list"), got: "bool"`,
		);
	});

	test('rejects invalid default-styles/optional-styles', () => {
		const suffix = 'expected one of ' + formatList(RMD_ALL_STYLES);
		expectSassError(
			`@include rmd.config(
				$default-styles: (based, cool-cat, lolwhat)
			);`,
			`$default-styles has unknown style name "based", ${suffix}`,
		);
		expectSassError(
			`@include rmd.config(
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
			const { values } = scss`
				@include rmd.config(
					$base-selector: "${selectors.base}",
					$default-selector: "${selectors.default}",
					$option-selector: "${selectors.option}"
				);
				@debug capture(base, config.get(base-selector));
				@debug capture(default, config.get(default-selector));
				@debug capture(option, config.get(option-selector));
			`;
			expect(values).toEqual(selectors);
		}
	});

	test('rejects invalid selectors', () => {
		expectSassError(
			`@include rmd.config($base-selector: "")`,
			`$base-selector cannot be an empty string`,
		);
		expectSassError(
			`@include rmd.config($option-selector: "")`,
			`$option-selector cannot be an empty string`,
		);
		expectSassError(
			`@include rmd.config($option-selector: ".rmd")`,
			`$option-selector must contain the substring "%s", got ".rmd"`,
		);
	});

	test('setting $default-styles impacts optional styles', () => {
		const { values } = scss`
			@include rmd.config(
				$preset: default,
				$default-styles: (base-reset, hn-reset),
				$optional-styles: true,
			);
			@debug capture(default, config.get(default-styles));
			@debug capture(has-hn-prefix, config.has-option(hn-prefix));
		`;

		expect(values).toEqual({
			default: ['base-reset', 'hn-reset'],
			'has-hn-prefix': true,
		});
	});
});

function expectSassError(source: string, message: string) {
	const { logs } = scss(source);
	expect(logs).toContainEqual({ type: 'error', message });
}

function formatList(list: string[]): string {
	const quoted = list.map((str) => JSON.stringify(str));
	return `(${quoted.join(', ')})`;
}
