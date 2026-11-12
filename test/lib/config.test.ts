import { describe, expect, test } from 'vitest';

import { DEFAULTS, DEFAULTS_ZERO, expectScssExports, scssTemplate } from '../shared';

const scss = scssTemplate(`
	@use "./lib/config" as config;
	@use "./lib/toolkit/selector" as *;
`);

describe('config namespace', () => {
	test('check exports', () => {
		expectScssExports('config', {
			functions: [
				'filter-default-styles',
				'filter-optional-styles',
				'get',
				'get-all',
				'has-default-style',
				'has-optional-style',
			],
			mixins: ['set', 'set-all'],
			variables: [],
		});
	});
});

describe('config.get-all()', () => {
	test('returns the default config map', () => {
		const { values, error } = scss`
			@debug capture(config, config.get-all());
		`;
		expect(error).toBeUndefined();
		expect(values.config).toEqual(DEFAULTS);
	});

	test('returns the updated config map', () => {
		const { values, error } = scss`
			@include config.set-all((
				preset: zero,
				hn-prefix: "!!!"
			));
			@debug capture(config, config.get-all());
		`;
		expect(error).toBeUndefined();
		expect(values.config).toEqual({
			...DEFAULTS_ZERO,
			'hn-prefix': '!!!',
		});
	});
});

describe('config.get()', () => {
	test('returns values from default config map', () => {
		const { values, error } = scss`
			@debug capture(defaultStyles, config.get(default-styles));
			@debug capture(hnPrefix, config.get(hn-prefix));
		`;
		expect(error).toBeUndefined();
		expect(values.defaultStyles).toEqual(DEFAULTS['default-styles']);
		expect(values.hnPrefix).toEqual(DEFAULTS['hn-prefix']);
	});

	test('returns values from updated config map', () => {
		const { values, error } = scss`
			@include config.set-all((
				preset: zero,
				hn-prefix: "!!!"
			));
			@debug capture(defaultStyles, config.get(default-styles));
			@debug capture(hnPrefix, config.get(hn-prefix));
		`;
		expect(error).toBeUndefined();
		expect(values.defaultStyles).toEqual(DEFAULTS_ZERO['default-styles']);
		expect(values.hnPrefix).toEqual('!!!');
	});
});
