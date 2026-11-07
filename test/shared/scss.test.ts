import { describe, expect, test } from 'vitest';

import { scss } from './scss';

describe(`scss() helper`, () => {
	test('compiles basic sass', () => {
		const { css, error } = scss`
			$test: "world";
			.test { content: "hello " + $test }
		`;
		expect(error).toBeUndefined();
		expect(css).toBe(`.test {\n  content: "hello world";\n}`);
	});

	test('captures @debug and @warn', () => {
		const { logs, error } = scss`
			@debug "A debug message";
			@debug "Another debug message";
			@warn "A warning";
		`;
		expect(error).toBeUndefined();
		expect(logs).toEqual([
			{ type: 'debug', message: 'A debug message' },
			{ type: 'debug', message: 'Another debug message' },
			{ type: 'warn', message: 'A warning' },
		]);
	});

	test('captures first @error', () => {
		const { error, logs } = scss`
			@debug "A debug message";
			@error "First error message";
			@debug "Then a debug one";
			@error "A second error";
		`;

		// First error is captured
		expect(error).toBeDefined();
		expect(error?.sassMessage).toMatch('First error message');

		// compilation and logs should stop after first error
		expect(logs).toEqual([
			{ type: 'debug', message: 'A debug message' },
			{ type: 'error', message: 'First error message' },
		]);
	});

	test('captures @debug and @warn', () => {
		const { logs, error } = scss`
			@debug "A debug message";
			@debug "Another debug message";
			@warn "A warning";
		`;
		expect(error).toBeUndefined();
		expect(logs).toEqual([
			{ type: 'debug', message: 'A debug message' },
			{ type: 'debug', message: 'Another debug message' },
			{ type: 'warn', message: 'A warning' },
		]);
	});

	test('capture() custom function', () => {
		const { error, logs, values } = scss`
			$default-styles: (base-reset, hn-prefix);
			$margins: (h1: (top: 24px), p: (bottom: 0.5rem));
			@debug capture(default-styles, $default-styles);
			@debug capture(margins, $margins);
		`;
		expect(error).toBeUndefined();

		// @debug adds to logs as simple strings
		expect(logs).toEqual([
			{ type: 'debug', message: 'base-reset, hn-prefix' },
			{ type: 'debug', message: '(h1: (top: 24px), p: (bottom: 0.5rem))' },
		]);

		// capture() adds to values object, and converts Sass values into JS
		expect(values).toEqual({
			'default-styles': ['base-reset', 'hn-prefix'],
			margins: { h1: { top: '24px' }, p: { bottom: '0.5rem' } },
		});
	});
});
