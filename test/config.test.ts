import { describe, expect, test } from 'vitest';

import {
	RMD_ALL_STYLES,
	RMD_CONFIG_KEYS,
	RMD_DEFAULTS,
	RMD_ZERO_DEFAULTS,
	scss,
	sortedKeys,
	type ScssResult,
} from './shared';

describe('rmd.config()', () => {
	test('calling with no value keeps defaults', () => {
		const { values } = scss`
			@include rmd.config();
			@debug capture(defaults, config.get(defaults));
		`;
		expect(sortedKeys(values.defaults)).toEqual(RMD_DEFAULTS);
	});

	test('using default preset keeps defaults', () => {
		const { values } = scss`
			@include rmd.config($preset: default);
			@debug capture(defaults, config.get(defaults));
		`;
		expect(sortedKeys(values.defaults)).toEqual(RMD_DEFAULTS);
	});

	test('can set Remarkdown-zero defaults', () => {
		const { values } = scss`
			@include rmd.config($preset: zero);
			@debug capture(defaults, config.get(defaults));
			@debug capture(options, config.get(options));
		`;
		expect(sortedKeys(values.defaults)).toEqual(RMD_ZERO_DEFAULTS);
		expect(values.options).toBe(true);
	});

	test('can set custom defaults', () => {
		const { values } = scss`
			@include rmd.config($defaults: (base-text, hn-reset, em-reset, strong-reset));
			@debug capture(defaults, config.get(defaults));
		`;
		expect(values.defaults).toEqual(['base-text', 'hn-reset', 'em-reset', 'strong-reset']);
	});

	test('can set custom options', () => {
		const { values } = scss`
			@include rmd.config($options: (ul-dash, hn-prefix));
			@debug capture(options, config.get(options));
		`;
		expect(values.options).toEqual(['ul-dash', 'hn-prefix']);
	});

	test('$defaults and $options accept a single string', () => {
		const { values } = scss`
			@include rmd.config($defaults: base-text, $options: h1-line);
			@debug capture(defaults, config.get(defaults));
			@debug capture(options, config.get(options));
		`;
		expect(values.defaults).toEqual(['base-text']);
		expect(values.options).toEqual(['h1-line']);
	});

	test('accepts a config map instead of named params', () => {
		const { values } = scss`
			$config: (font: ("Consolas", monospace), line-height: 1.42);
			@include rmd.config($config);
			@debug capture(font, config.get(font));
			@debug capture(lineHeight, config.get(line-height));
		`;
		expect(values.font).toEqual(['Consolas', 'monospace']);
		expect(values.lineHeight).toEqual(1.42);
	});

	test('can set any valid config value', () => {
		const expected: ScssResult['values'] = {
			selectors: { default: '', option: '.%s', root: ':root' },
			variables: `--%s`,
			font: ['Comic Sans Mono', 'monospace'],
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
				$variables: "--%s",
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

	test('custom margins are merged with defaults', () => {
		const expected: ScssResult['values'] = {
			h1: { top: 3.5, bottom: 1.5 },
			h2: { top: 1.5, bottom: 1 },
			ol: { top: 1, bottom: 1, 'inline-start': 3, 'inline-end': 0 },
			blockquote: { top: 1, bottom: 1, 'inline-start': 2, 'inline-end': 2 },
		};

		const { values } = scss`
			// set custom margins for h1 only
			@include rmd.config($margins: (h1: (top: 3.5, bottom: 1.5)));

			// print out margins for h1 and a few other elements
			@each $el in (h1, h2, ol, blockquote) {
				@debug capture($el, config.get(margins $el));
			}
		`;

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

	test('rejects invalid defaults/options', () => {
		const suffix = 'expected one of ' + formatList(RMD_ALL_STYLES);
		expectSassError(
			`@include rmd.config($defaults: (base cool-style))`,
			`$defaults has unknown style name "base", ${suffix}`,
		);
		expectSassError(
			`@include rmd.config($options: (h1-line "Hello!"))`,
			`$options has unknown style name "Hello!", ${suffix}`,
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

	test('setting $defaults updates $options', () => {
		const { values } = scss`
			@include rmd.config(
				$preset: default,
				$defaults: (base-text, hn-reset),
				$options: true,
			);
			@debug capture(defaults, config.get(defaults));
			@debug capture(has-hn-prefix, config.has-option(hn-prefix));
		`;

		expect(values).toEqual({
			defaults: ['base-text', 'hn-reset'],
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
