import type { Exception } from 'sass';

export type JSValue = null | boolean | number | string | any[] | Record<string, any>;

export type ScssResult = {
	css: string;
	error?: Exception;
	logs: Array<{ type: 'debug' | 'warn' | 'error'; message: string }>;
	values: Record<string, JSValue>;
};
