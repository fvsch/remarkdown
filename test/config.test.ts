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
			@include rmd.config($default-styles: (font-reset, hn-reset, em-reset, strong-reset));
			@debug capture(default, config.get(default-styles));
		`;
		expect(values.default).toEqual(['font-reset', 'hn-reset', 'em-reset', 'strong-reset']);
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
			@include rmd.config($default-styles: font-reset, $optional-styles: h1-line);
			@debug capture(default, config.get(default-styles));
			@debug capture(optional, config.get(optional-styles));
		`;
		expect(values.default).toEqual(['font-reset']);
		expect(values.optional).toEqual(['h1-line']);
	});

	test('accepts a config map instead of named params', () => {
		const { values } = scss`
			$config: (font: ("Consolas", monospace), line-height: 1.42);
			@include rmd.config($config);
			@debug capture(font, config.get(font));
			@debug capture(lh, config.get(line-height));
		`;
		expect(values.font).toEqual(['Consolas', 'monospace']);
		expect(values.lh).toEqual(1.42);
	});

	test('can set any valid config value', () => {
		const expected: ScssResult['values'] = {
			selectors: { default: '', option: '.%s', root: ':root' },
			'css-var': `--%s`,
			font: ['Comic Sans Mono', 'monospace'],
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

		const { values } = scss`
			@include rmd.config(
				$selectors: (default: "", option: ".%s", root: ":root"),
				$css-var: "--%s",
				$font: ("Comic Sans Mono", monospace),
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
			`@include rmd.config($font: false)`,
			`$font's type must be one of ("null", "string", "list"), got: "bool"`,
		);
	});

	test('rejects invalid default-styles/optional-styles', () => {
		const suffix = 'expected one of ' + formatList(RMD_ALL_STYLES);
		expectSassError(
			`@include rmd.config(
				$default-styles: (base, cool-style, lolwhat)
			);`,
			`$default-styles has unknown style name "base", ${suffix}`,
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
			{ default: '.rmd', option: '.rmd--%s' },
			{ default: '.rmd', option: '.rmd--%s', root: '.rmd' },
			{ default: '', option: '.%s', root: ':root' },
			// invalid CSS selectors not caught by basic type/string validation
			{ default: '{}', option: '!!%s', root: '...' },
		];
		for (const selectors of valid) {
			const sassMap = JSON.stringify(selectors)
				.replace(/^\s*\{/, '(')
				.replace(/\}\s*$/, ')');
			const { values } = scss`
				@include rmd.config($selectors: ${sassMap});
				@debug capture(selectors, config.get(selectors));
			`;
			expect(values.selectors).toEqual(selectors);
		}
	});

	test('rejects invalid selectors', () => {
		expectSassError(
			`@include rmd.config($selectors: ".rmd")`,
			`$selectors must be a map, got: ".rmd"`,
		);
		expectSassError(
			`@include rmd.config($selectors: (option: ""))`,
			`$selectors must have a 'default' key, got: (option: "")`,
		);
		expectSassError(
			`@include rmd.config($selectors: (default: ""))`,
			`$selectors must have a 'option' key, got: (default: "")`,
		);
		expectSassError(
			`@include rmd.config($selectors: (default: "", option: ""))`,
			`$selectors.option cannot be an empty string`,
		);
		expectSassError(
			`@include rmd.config($selectors: (default: "", option: ".rmd"))`,
			`$selectors.option must contain the substring "%s", got ".rmd"`,
		);
	});

	test('setting $default-styles impacts optional styles', () => {
		const { values } = scss`
			@include rmd.config(
				$preset: default,
				$default-styles: (font-reset, hn-reset),
				$optional-styles: true,
			);
			@debug capture(default, config.get(default-styles));
			@debug capture(has-hn-prefix, config.has-option(hn-prefix));
		`;

		expect(values).toEqual({
			default: ['font-reset', 'hn-reset'],
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
