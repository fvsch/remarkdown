import type { Exception } from 'sass';

export type JSValue = null | boolean | number | string | any[] | Record<string, any>;

export type ScssException = Exception & { testMessage: string };

export type ScssResult = {
	css: string;
	error?: ScssException;
	logs: Array<{ type: 'debug' | 'warn' | 'error'; message: string }>;
	scss: string;
	values: Record<string, JSValue>;
};
