import {
	compileString,
	Exception,
	SassBoolean,
	SassList,
	SassMap,
	SassNumber,
	SassString,
	sassNull,
	type StringOptions,
	type Value,
} from 'sass';
import { expect } from 'vitest';

import { localPath } from './meta';
import type { JSValue, ScssException, ScssResult } from './types';

type TemplateStringFn<T> = (str: string | TemplateStringsArray, ...values: any[]) => T;

export function scssTemplate(scssPrefix: string): TemplateStringFn<ScssResult> {
	return (str, ...substitutions) => {
		const input = tplToString(str, ...substitutions);
		const source = `${scssPrefix.trim()}\n\n${input.trim()}\n`;
		const result: ScssResult = {
			scss: source,
			css: '',
			logs: [],
			values: {},
		};
		try {
			const options = getSassOptions(result);
			result.css = compileString(source, options).css;
		} catch (err) {
			if (err instanceof Exception) {
				const error = err as ScssException;
				error.testMessage = trimQuotes(error.sassMessage);
				result.logs.push({ type: 'error', message: error.testMessage });
				result.error = error;
			} else {
				throw err;
			}
		}
		return result;
	};
}

function getSassOptions(result: Pick<ScssResult, 'logs' | 'values'>): StringOptions<'sync'> {
	return {
		alertColor: false,
		loadPaths: [localPath()],
		logger: {
			debug(message, _opt) {
				result.logs.push({ type: 'debug', message });
			},
			warn(message, opt) {
				if (!opt.deprecation) {
					result.logs.push({ type: 'warn', message });
				}
			},
		},
		functions: {
			// track a JS representation of a Sass Value,
			// then pass the value through
			'capture($id, $data)': ([id, data]) => {
				const key = id.assertString('id').toString();
				result.values[trimQuotes(key)] = sassValueToJS(data);
				return data;
			},
		},
	};
}

export function expectScssExports(
	module: 'rmd' | 'config' | 'styles',
	keys: Record<'functions' | 'mixins' | 'variables', string[]>,
) {
	const scss = scssTemplate(`
		@use "sass:meta";
		@use "sass:map";
		@use "./lib" as rmd;
		@use "./lib/config" as config;
		@use "./lib/styles" as styles;
	`);
	const { values, error } = scss`
		$mod: "${module}";
		$functions: meta.module-functions($mod);
		$mixins: meta.module-mixins($mod);
		$variables: meta.module-variables($mod);
		@debug capture(functions, map.keys($functions));
		@debug capture(mixins, map.keys($mixins));
		@debug capture(variables, map.keys($variables));
	`;
	expect(error).toBeUndefined();
	expect(sortedKeys(values.functions)).toEqual(keys.functions);
	expect(sortedKeys(values.mixins)).toEqual(keys.mixins);
	expect(sortedKeys(values.variables)).toEqual(keys.variables);
}

export function sortedKeys(input: JSValue): string[] {
	if (!input || typeof input !== 'object') {
		return [];
	} else if (Array.isArray(input)) {
		return input.filter((v) => typeof v === 'string').toSorted();
	} else {
		return Object.keys(input).toSorted();
	}
}

export function formatStringList(list: string[]): string {
	const quoted = list.map((str) => JSON.stringify(str));
	return `(${quoted.join(', ')})`;
}

export function expectSassError(result: ScssResult, message: string) {
	expect(result.error).toBeDefined();
	expect(result.logs).toContainEqual({
		type: 'error',
		message,
	});
}

function trimQuotes(input: string) {
	if (
		(input.startsWith(`"`) && input.endsWith(`"`)) ||
		(input.startsWith(`'`) && input.endsWith(`'`))
	) {
		return input.slice(1, -1).replace(/\\(["'])/g, '$1');
	}
	return input;
}

function sassValueToJS(value: Value): JSValue {
	if (value === sassNull) {
		return null;
	} else if (value instanceof SassBoolean) {
		return value.value;
	} else if (value instanceof SassNumber) {
		return value.hasUnits ? value.toString() : value.value;
	} else if (value instanceof SassString) {
		return value.text;
	} else if (value instanceof SassList) {
		return [...value.asList].map((val) => sassValueToJS(val));
	} else if (value instanceof SassMap) {
		const result: Record<string, any> = {};
		for (const item of value.asList) {
			const [key, val] = item.asList;
			result[trimQuotes(key.assertString().text)] = sassValueToJS(val);
		}
		return result;
	}
	return value.toString();
}

function tplToString(str: string | TemplateStringsArray, ...substitutions: any[]): string {
	const raw = typeof str === 'string' ? [str] : str;
	return String.raw({ raw }, ...substitutions);
}
