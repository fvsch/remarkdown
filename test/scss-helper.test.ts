import { describe, expect, test } from 'vitest';

import { scss } from './shared';

describe(`scss() helper`, () => {
	test('compiles basic sass', () => {
		const { css } = scss`
			$test: "world";
			.test { content: "hello " + $test }
		`;
		expect(css).toBe(`.test {\n  content: "hello world";\n}`);
	});

	test('captures @debug and @warn', () => {
		const { logs } = scss`
			@debug "A debug message";
			@debug "Another debug message";
			@warn "A warning";
		`;
		expect(logs).toEqual([
			{ type: 'debug', message: 'A debug message' },
			{ type: 'debug', message: 'Another debug message' },
			{ type: 'warn', message: 'A warning' },
		]);
	});

	test('captures first @error', () => {
		const { logs } = scss`
			@debug "A debug message";
			@error "An error message";
			// compilation should stop after first error
			@debug "Then a debug one";
			@error "A second error";
		`;
		expect(logs).toEqual([
			{ type: 'debug', message: 'A debug message' },
			{ type: 'error', message: 'An error message' },
		]);
	});

	test('captures @debug and @warn', () => {
		const { logs } = scss`
			@debug "A debug message";
			@debug "Another debug message";
			@warn "A warning";
		`;
		expect(logs).toEqual([
			{ type: 'debug', message: 'A debug message' },
			{ type: 'debug', message: 'Another debug message' },
			{ type: 'warn', message: 'A warning' },
		]);
	});

	test('capture() custom function', () => {
		const { logs, values } = scss`
			$defaults: (text-base, hn-prefix);
			$margins: (h1: (top: 2rem), p: (bottom: 0.5rem));
			@debug capture(defaults, $defaults);
			@debug capture(margins, $margins);
		`;

		// @debug adds to logs as simple strings
		expect(logs).toEqual([
			{ type: 'debug', message: 'text-base, hn-prefix' },
			{ type: 'debug', message: '(h1: (top: 2rem), p: (bottom: 0.5rem))' },
		]);

		// capture() adds to values object, and converts Sass values into JS
		expect(values).toEqual({
			defaults: ['text-base', 'hn-prefix'],
			margins: { h1: { top: 2 }, p: { bottom: 0.5 } },
		});
	});
});
