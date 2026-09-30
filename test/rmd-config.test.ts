import { describe, expect, test } from 'vitest';

import { RMD_DEFAULTS, RMD_ZERO_DEFAULTS } from './shared/data';
import { findArray, findDefaults, findOutput, scss } from './shared/helpers';

describe('rmd.config', () => {
	test('calling with no value keeps defaults', () => {
		const css = scss`
			@include rmd.config();
			@include rmd.header();
		`;
		const defaults = findDefaults(css);
		expect(defaults).toEqual(RMD_DEFAULTS);
	});

	test('using default preset keeps defaults', () => {
		const css = scss`
			@include rmd.config($preset: default);
			@include rmd.header();
		`;
		const defaults = findDefaults(css);
		expect(defaults).toEqual(RMD_DEFAULTS);
	});

	test('can set Remarkdown-zero defaults', () => {
		const css = scss`
			@include rmd.config($preset: zero);
			@include rmd.header();
			@include test.array(rmd-config.get(options));
		`;

		const defaults = findDefaults(css);
		expect(defaults).toEqual(RMD_ZERO_DEFAULTS);

		const options = findArray(css);
		expect(options).toContain('hn-prefix');
		expect(options).toContain('h1-line');
		expect(options).toContain('ul-dash');
	});

	test('can set custom defaults', () => {
		const css = scss`
			@include rmd.config($defaults: (base-text, hn-reset, em-reset, strong-reset));
			@include rmd.header();
		`;
		const defaults = findDefaults(css);
		expect(defaults).toEqual(['base-text', 'em-reset', 'hn-reset', 'strong-reset']);
	});

	test('can set custom options', () => {
		const css = scss`
			@include rmd.config($options: (hn-prefix, ul-dash));
			@include test.array(rmd-config.get(options), "OPTIONS");
		`;
		const options = findArray(css, 'OPTIONS');
		expect(options).toEqual(['hn-prefix', 'ul-dash']);
	});

	test('defaults and options accept a single string', () => {
		const css = scss`
			@include rmd.config($defaults: base-text, $options: h1-line);
			@include test.array(rmd-config.get(defaults), "DEFAULTS");
			@include test.array(rmd-config.get(options), "OPTIONS");
		`;
		const defaults = findArray(css, 'DEFAULTS');
		expect(defaults).toEqual(['base-text']);

		const options = findArray(css, 'OPTIONS');
		expect(options).toEqual(['h1-line']);
	});

	test('accepts a config map instead of named params', () => {
		const css = scss`
			$config: (font: ("Consolas", monospace), line-height: 1.42);
			@include rmd.config($config);
			@include test.array(rmd-config.get(font), "CONFIG.font");
			@include test.dump(rmd-config.get(line-height), "CONFIG.line-height");
		`;

		const font = findArray(css, 'CONFIG.font');
		expect(font).toEqual(['Consolas', 'monospace']);

		const lineHeight = findOutput(css, 'CONFIG.line-height');
		expect(lineHeight).toEqual(`1.42`);
	});

	test('can set any valid config value', () => {
		const css = scss`
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
			@each $key, $val in rmd-config.get-all() {
				@include test.dump($val, "CONFIG.#{$key}");
			}
		`;

		const expected = {
			selectors: `(default: "", option: ".%s", root: ":root")`,
			variables: `"--%s"`,
			font: `"Comic Sans Mono", monospace`,
			line_height: `2`,
			hn_prefix: `"!"`,
			h1_line: `"~~~~~~"`,
			h2_line: `"^^^^^^"`,
			ul_dash: `"_"`,
			ul_star: `"$"`,
			ul_plus: `"%"`,
			ol_mark: `")"`,
			pre_ticks: `"'''"`,
			pre_tilde: `"^^^"`,
			pre_tilde_line: `"^__________^ "`,
			quote_mark: `"|\\a|\\a|\\a|\\a|\\a"`,
			quote_rtl: `"|\\a|\\a|\\a|\\a|\\a"`,
			hr_stars: `"***"`,
			hr_dashes: `"---"`,
			table_vline: `"/\\a/\\a/\\a/\\a/\\a/\\a"`,
			table_hline: `"-_-_-_-_-_-_"`,
		};

		for (const [key, val] of Object.entries(expected)) {
			const name = key.replaceAll('_', '-');
			const out = findOutput(css, 'CONFIG.' + name);
			expect(out, `config value for $${name}`).toBe(val);
		}
	});

	test('custom margins are merged with defaults', () => {
		const expected = {
			h1: `(top: 3.5, bottom: 1.5)`,
			h2: `(top: 1.5, bottom: 1)`,
			ol: `(top: 1, bottom: 1, inline-start: 3, inline-end: 0)`,
			blockquote: `(top: 1, bottom: 1, inline-start: 2, inline-end: 2)`,
		};

		const css = scss`
			// set custom margins for h1 only
			@include rmd.config($margins: (h1: ${expected.h1}));

			// print out margins for h1 and a few other elements
			@each $el in (${Object.keys(expected).join(', ')}) {
				@include test.dump(rmd-config.get(margins $el), "MARGINS.#{$el}");
			}
		`;

		for (const [el, val] of Object.entries(expected)) {
			const margins = findOutput(css, `MARGINS.${el}`);
			expect(margins, `margins for ${el}`).toEqual(val);
		}
	});

	test('unknown options are rejected', () => {
		const err1 = scss`@include rmd.config($font-family: "Comic Sans MS")`;
		expect(err1).toMatch(
			`Unknown option $font-family, expected one of ("selectors", "variables", "defaults", "options", "font", "code-font", "line-height", "margins", "hn-prefix", "h1-line", "h2-line", "ul-dash", "ul-star", "ul-plus", "ol-mark", "pre-ticks", "pre-tilde", "pre-tilde-line", "quote-mark", "quote-rtl", "hr-stars", "hr-dashes", "table-vline", "table-hline")`,
		);

		const err2 = scss`@include rmd.config((doesnt-exist: whoops))`;
		expect(err2).toMatch(`Unknown option $doesnt-exist`);
	});

	test('rejects incorrect types', () => {
		const err1 = scss`@include rmd.config($line-height: "150%")`;
		expect(err1).toMatch(`$line-height's type must be "number", got: "string"`);

		const err2 = scss`@include rmd.config($font: false)`;
		expect(err2).toMatch(`$font's type must be one of ("null", "string", "list"), got: "bool"`);
	});

	test('rejects invalid defaults/options', () => {
		const err1 = scss`@include rmd.config($defaults: (base cool-style))`;
		expect(err1).toMatch(
			`$defaults has unknown option "base", expected one of ("a-bracket", "a-showurl", "base-text", "code-tick", "del-tilde", "em-reset", "em-star", "em-underscore", "h1-line", "h2-line", "hn-prefix", "hn-reset", "hr-center", "hr-dash", "hr-star", "ol-alpha", "ol-decimal", "ol-zero", "pre-indent", "pre-tick", "pre-tilde", "pre-tilde-full", "quote-mark", "strong-reset", "strong-star", "strong-underscore", "table-border", "table-border-full", "table-reset", "ul-dash", "ul-plus", "ul-star")`,
		);

		const err2 = scss`@include rmd.config($options: (h1-line "Hello!"))`;
		expect(err2).toMatch(`$options has unknown option "Hello!"`);
	});

	test('rejects invalid selectors', () => {
		const noMap = scss`@include rmd.config($selectors: ".rmd")`;
		expect(noMap).toMatch(`$selectors must be a map`);

		const noDefault = scss`@include rmd.config($selectors: (option: ""))`;
		expect(noDefault).toMatch(`$selectors must have a 'default' key`);

		const noOption = scss`@include rmd.config($selectors: (default: ""))`;
		expect(noOption).toMatch(`$selectors must have a 'option' key`);

		const badOption = scss`@include rmd.config($selectors: (default: "", option: ""))`;
		expect(badOption).toMatch(`$selectors.option cannot be an empty string`);

		const badbad = scss`@include rmd.config($selectors: (default: "", option: ".rmd"))`;
		expect(badbad).toMatch(`$selectors.option must contain the substring "%s"`);
	});

	test('accepts valid selectors', () => {
		const valid = [
			`(default: ".rmd", option: ".rmd--%s")`,
			`(default: ".rmd", option: ".rmd--%s", root: ".rmd")`,
			`(default: "", option: ".%s", root: ":root")`,
			// invalid CSS selectors not caught by basic type/string validation
			`(default: "{}", option: "!!%s", root: "...")`,
		];

		for (const selectors of valid) {
			const css = scss`
				@include rmd.config($selectors: ${selectors});
				@include test.dump(rmd-config.get(selectors), "CONFIG.selectors");
			`;
			const out = findOutput(css, 'CONFIG.selectors');
			expect(out).toBe(selectors);
		}
	});
});
