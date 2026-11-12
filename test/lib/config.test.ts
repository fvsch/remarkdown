import { describe, expect, test } from 'vitest';

import { DEFAULTS, DEFAULTS_ZERO, expectScssExports, scss, unknownStyle } from '../shared';

describe('config namespace', () => {
	test('check exports', () => {
		expectScssExports('config', {
			functions: ['get', 'get-all', 'has-default', 'has-option', 'new'],
			mixins: ['set', 'set-all'],
			variables: [],
		});
	});
});

describe('config.new()', () => {
	test('returns a map with defaults', () => {
		const { values, error } = scss`
			$config: config.new();
			@debug capture(config, $config);
		`;
		expect(error).toBeUndefined();
		expect(values.config).toEqual(DEFAULTS);
	});

	test('can use presets', () => {
		const { values, error } = scss`
			$defaults: config.new(default);
			$zero: config.new(zero);
			@debug capture(defaults, $defaults);
			@debug capture(zero, $zero);
		`;
		expect(error).toBeUndefined();
		expect(values.defaults).toEqual(DEFAULTS);
		expect(values.zero).toEqual(DEFAULTS_ZERO);
	});

	test('can override config fields', () => {
		const { values, error } = scss`
			$config: config.new(default, (
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

	test('returns a map with the first error message', () => {
		const { error, values } = scss`
			$config: config.new(default, (
				default-styles: (reset, h1-prefix),
				optional-styles: never
			));
			@debug capture(config, $config);
		`;
		expect(error).toBeUndefined();
		expect(values.config).toEqual({
			error: unknownStyle('default-styles', 'reset'),
		});
	});
});

describe('config.get-all()', () => {
	test('returns the current config map', () => {
		const { values, error } = scss`
			$config1: config.get-all();
			@include config.set(hn-prefix, "!");
			$config2: config.get-all();
			@debug capture(config1, $config1);
			@debug capture(config2, $config2);
		`;
		expect(error).toBeUndefined();
		expect(values.config1).toEqual(DEFAULTS);
		expect(values.config2).toEqual({
			...DEFAULTS,
			'hn-prefix': '!',
		});
	});
});
