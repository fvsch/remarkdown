import { describe, expect, test } from 'vitest';

import {
	ALL_STYLES,
	DEFAULTS,
	DEFAULTS_ZERO,
	formatStringList,
	scssTemplate,
	unknownOption,
	unknownStyle,
} from '../shared';

const scss = scssTemplate(`
	@use "sass:map";
	@use "./lib/config/core" as config-core;
`);

describe('config-core.new()', () => {
	test('returns a map with defaults', () => {
		const { error, values } = scss`
			@debug capture(config, config-core.new());
		`;
		expect(error).toBeUndefined();
		expect(values.config).toEqual(DEFAULTS);
	});

	test('can use presets', () => {
		const { error, values } = scss`
			@debug capture(defaults, config-core.new(default));
			@debug capture(zero, config-core.new(zero));
		`;
		expect(error).toBeUndefined();
		expect(values.defaults).toEqual(DEFAULTS);
		expect(values.zero).toEqual(DEFAULTS_ZERO);
	});

	test('can override config fields', () => {
		const { error, values } = scss`
			$config: config-core.new(default, (
				default-styles: (base-reset, hn-prefix),
				optional-styles: false
			));
			@debug capture(defaultStyles, map.get($config, default-styles));
			@debug capture(optionalStyles, map.get($config, optional-styles));
			@debug capture(hnPrefix, map.get($config, hn-prefix));
		`;
		expect(error).toBeUndefined();
		expect(values.defaultStyles).toEqual(['base-reset', 'hn-prefix']);
		expect(values.optionalStyles).toBe(false);
		expect(values.hnPrefix).toBe('#');
	});

	test('validates user config', () => {
		const result1 = scss`
			$config: config-core.new(default, (
				default-styles: ("h1-reset", "h3-line"),
			));
			@debug capture(config, $config);
		`;
		const result2 = scss`
			$config: config-core.new(zero, (hn-prefix: 9));
			@debug capture(config, $config);
		`;
		expect(result1.error).toBeDefined();
		expect(result1.error?.testMessage).toMatch(unknownStyle('default-styles', 'h1-reset'));
		expect(result2.error).toBeDefined();
		expect(result2.error?.testMessage).toMatch(
			`Type of $hn-prefix must be "string", got: "number"`,
		);
	});
});

describe('config-core.get()', () => {
	test('validates accessor key', () => {
		const { error } = scss`
			$config: map.remove(());
			$value: config-core.get($config, bad-option);
			@debug capture(badOption, $value);
		`;
		expect(error).toBeDefined();
		expect(error?.testMessage).toMatch(unknownOption('bad-option'));
	});

	test('validates that config has accessed key', () => {
		const { error } = scss`
			$config: (base-selector: "body", default-selector: "#remarkdown");
			@debug capture(missingOption, config-core.get($config, option-selector));
		`;
		expect(error).toBeDefined();
		expect(error?.testMessage).toMatch(`Missing "option-selector" key in map`);
	});

	test('retrieves top-level values', () => {
		const { error, values } = scss`
			$config: (default-selector: "#remarkdown", hn-prefix: "%");
			@debug capture(defaultSelector, config-core.get($config, default-selector));
			@debug capture(hnPrefix, config-core.get($config, hn-prefix));
		`;
		expect(error).toBeUndefined();
		expect(values.defaultSelector).toBe('#remarkdown');
		expect(values.hnPrefix).toBe('%');
	});

	test('retrieves deep values', () => {
		const { error, values } = scss`
			$config: (
				margins: (
					default: (top: 0.666lh, bottom: 0.666lh),
					h2: (inline-start: 4ch)
				)
			);
			@debug capture(h2Margins, config-core.get($config, margins h2));
			@debug capture(defaultTopMargin, config-core.get($config, margins default top));
		`;
		expect(error).toBeUndefined();
		expect(values.h2Margins).toEqual({ 'inline-start': '4ch' });
		expect(values.defaultTopMargin).toBe('0.666lh');
	});
});

describe('config-core.set()', () => {
	test('validates option key', () => {
		const { error } = scss`
			$config: (default-styles: ("h1-prefix"), optional-styles: false);
			$config: config-core.set($config, bad-option, "hello");
			@debug capture(config, $config);
		`;
		expect(error).toBeDefined();
		expect(error?.testMessage).toMatch(`Unknown option $bad-option`);
	});

	test('validates option value', () => {
		const { error } = scss`
			$config: map.remove(());
			$config: config-core.set($config, css-vars, false);
			@debug capture(config, $config);
		`;
		expect(error).toBeDefined();
		expect(error?.testMessage).toMatch(`Type of $css-vars must be "string", got: "bool"`);
	});

	test('adds value to map', () => {
		const { error, values } = scss`
			$config: map.remove(());
			$config: config-core.set($config, hn-prefix, "$");
			@debug capture(config, $config);
		`;
		expect(error).toBeUndefined();
		expect(values.config).toEqual({
			'hn-prefix': '$',
		});
	});

	test('adds one value at a time', () => {
		const { error, values } = scss`
			$config: map.remove(());
			$config: config-core.set($config, hn-prefix, "$");
			$config: config-core.set($config, hn-prefix, "!?");
			$config: config-core.set($config, default-styles, (base-reset, hn-reset));
			$config: config-core.set($config, base-selector, ":root");
			@debug capture(config, $config);
		`;
		expect(error).toBeUndefined();
		expect(values.config).toEqual({
			'base-selector': ':root',
			'default-styles': ['base-reset', 'hn-reset'],
			'hn-prefix': '!?',
		});
	});
});

describe('config-core.has-default-style()', () => {
	function checkDefaultStyles(defaultStyles: string[], expected: Record<string, boolean>) {
		const { error, values } = scss`
			$config: (default-styles: ${formatStringList(defaultStyles)});
			$styles: ${formatStringList(Object.keys(expected))};
			@each $style in $styles {
				@debug capture($style, config-core.has-default-style($config, $style));
			}
		`;
		expect(error).toBeUndefined();
		expect(values).toEqual(expected);
	}

	test('with empty list', () => {
		checkDefaultStyles([], {
			'base-reset': false,
			'hn-prefix': false,
			'h1-line': false,
			'table-border': false,
		});
	});

	test('with default preset', () => {
		checkDefaultStyles(DEFAULTS['default-styles'], {
			'base-reset': true,
			'hn-prefix': true,
			'h1-line': false,
			'table-border': false,
		});
	});

	test('with zero preset', () => {
		checkDefaultStyles(DEFAULTS_ZERO['default-styles'], {
			'base-reset': true,
			'hn-prefix': false,
			'h1-line': false,
			'table-border': false,
		});
	});
});

describe('config-core.has-optional-style()', () => {
	function checkOptionalStyles(
		config: { defaultStyles: string[]; optionalStyles: string[] | boolean },
		expected: Record<string, boolean>,
	) {
		const { defaultStyles: def, optionalStyles: opt } = config;
		const { error, values } = scss`
			$config: (
				default-styles: ${formatStringList(def)},
				optional-styles: ${Array.isArray(opt) ? formatStringList(opt) : opt}
			);
			$styles: ${formatStringList(Object.keys(expected))};
			@each $style in $styles {
				@debug capture($style, config-core.has-optional-style($config, $style));
			}
		`;
		expect(error).toBeUndefined();
		expect(values).toEqual(expected);
	}

	test('with empty styles lists', () => {
		checkOptionalStyles(
			{ defaultStyles: [], optionalStyles: [] },
			{ 'base-reset': false, 'h1-line': false, 'table-reset': false },
		);
	});

	test('$optional-styles: false', () => {
		checkOptionalStyles(
			{ defaultStyles: [], optionalStyles: false },
			{ 'base-reset': false, 'h1-line': false, 'table-reset': false },
		);
	});

	test('$optional-styles: true', () => {
		checkOptionalStyles(
			{ defaultStyles: [], optionalStyles: true },
			{ 'base-reset': true, 'h1-line': true, 'table-reset': true },
		);
		checkOptionalStyles(
			{ defaultStyles: DEFAULTS['default-styles'], optionalStyles: DEFAULTS['optional-styles'] },
			{ 'base-reset': false, 'h1-line': true, 'table-reset': true },
		);
	});

	test('with explicit optional-styles list', () => {
		checkOptionalStyles(
			{ defaultStyles: ['hn-reset', 'hn-prefix'], optionalStyles: ['h1-line'] },
			{ 'hn-prefix': false, 'h1-line': true, 'h2-line': false },
		);
		// style is not optional if present in default-styles
		checkOptionalStyles(
			{ defaultStyles: ['h1-line', 'h2-line'], optionalStyles: true },
			{ 'hn-prefix': true, 'h1-line': false, 'h2-line': false },
		);
		checkOptionalStyles(
			{ defaultStyles: ['h1-line', 'h2-line'], optionalStyles: ['h1-line', 'h2-line'] },
			{ 'hn-prefix': false, 'h1-line': false, 'h2-line': false },
		);
	});
});

describe('config-core.filter-default-styles()', () => {
	function checkFiltered(defaultStyles: string[], styles: string[], expected: string[]) {
		const { error, values } = scss`
			$config: (default-styles: ${formatStringList(defaultStyles)});
			$styles: ${formatStringList(styles)};
			@debug capture(result, config-core.filter-default-styles($config, $styles));
		`;
		expect(error).toBeUndefined();
		expect((values.result as string[])?.toSorted()).toEqual(expected.toSorted());
	}

	test('returns the matched subset', () => {
		checkFiltered(
			['hn-reset', 'hn-prefix', 'h1-line', 'hr-center', 'hr-star'],
			['h1-line', 'h2-line', 'hr-dash', 'hr-star'],
			['h1-line', 'hr-star'],
		);
	});

	test('filters all styles against preset defaults', () => {
		checkFiltered(DEFAULTS['default-styles'], ALL_STYLES, DEFAULTS['default-styles']);
		checkFiltered(DEFAULTS_ZERO['default-styles'], ALL_STYLES, DEFAULTS_ZERO['default-styles']);
	});

	test('filters all styles when default-styles is empty', () => {
		checkFiltered([], ALL_STYLES, []);
		checkFiltered([], DEFAULTS['default-styles'], []);
	});

	test('keeps all styles when default-styles has all styles', () => {
		checkFiltered(ALL_STYLES, DEFAULTS['default-styles'], DEFAULTS['default-styles']);
		checkFiltered(
			ALL_STYLES,
			['table-reset', 'table-border', 'table-border-full'],
			['table-reset', 'table-border', 'table-border-full'],
		);
	});
});

describe('config-core.filter-optional-styles()', () => {
	function checkFiltered(
		config: { defaultStyles: string[]; optionalStyles: string[] | boolean },
		styles: string[],
		expected: string[],
	) {
		const { defaultStyles: def, optionalStyles: opt } = config;
		const { error, values } = scss`
			$config: (
				default-styles: ${formatStringList(def)},
				optional-styles: ${Array.isArray(opt) ? formatStringList(opt) : opt},
			);
			$styles: ${formatStringList(styles)};
			@debug capture(result, config-core.filter-optional-styles($config, $styles));
		`;
		expect(error).toBeUndefined();
		expect((values.result as string[])?.toSorted()).toEqual(expected.toSorted());
	}

	test('$optional-styles: false excludes all', () => {
		checkFiltered(
			{ defaultStyles: DEFAULTS['default-styles'], optionalStyles: false },
			ALL_STYLES,
			[],
		);
	});

	test('$optional-styles: true includes all values', () => {
		checkFiltered(
			{ defaultStyles: [], optionalStyles: true },
			['h1-line', 'h2-line'],
			['h1-line', 'h2-line'],
		);
		checkFiltered({ defaultStyles: [], optionalStyles: true }, ALL_STYLES, ALL_STYLES);
	});

	test('$optional-styles: true excludes values in default-styles', () => {
		checkFiltered(
			{
				defaultStyles: ALL_STYLES.filter((s) => !s.startsWith('table-')),
				optionalStyles: true,
			},
			ALL_STYLES,
			['table-border', 'table-border-full', 'table-reset'],
		);
	});

	test('with explicit style lists', () => {
		checkFiltered(
			{
				defaultStyles: ['hn-reset', 'hn-prefix'],
				optionalStyles: ['hn-reset', 'hn-prefix', 'h1-line', 'h2-line'],
			},
			ALL_STYLES,
			['h1-line', 'h2-line'],
		);
	});
});
