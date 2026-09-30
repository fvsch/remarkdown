import { join } from 'node:path';
import { parse } from 'postcss';
import { compileString, type Exception } from 'sass';
import { expect } from 'vitest';

import packageJson from '../../package.json' with { type: 'json' };

const rootDir = join(import.meta.dirname, '..', '..');

const scssPrefix = `
@use "sass:list";
@use "sass:map";
@use "sass:meta";

@use "./lib/rmd" as rmd;
@use "./lib/config" as rmd-config;
@use "./lib/styles" as rmd-styles;
@use "./test/shared/helpers" as test;
`.trimStart();

export const pkg = packageJson;

export function localPath(subPath?: string) {
	return subPath ? join(rootDir, subPath) : rootDir;
}

export const scss = (strings: string | TemplateStringsArray, ...values: any[]) => {
	const raw = typeof strings === 'string' ? [strings] : strings;
	const src = String.raw({ raw }, ...values);
	return compileScss(src);
};

function compileScss(scss: string) {
	try {
		return compileString(scssPrefix + scss, { loadPaths: [rootDir] }).css;
	} catch (err) {
		const msg = (err as Exception).sassMessage;
		if (typeof msg === 'string') return trimQuotes(msg);
		return (err as Error).message;
	}
}

function trimQuotes(str: string) {
	if ((str.startsWith(`"`) && str.endsWith(`"`)) || (str.startsWith(`'`) && str.endsWith(`'`))) {
		return str.slice(1, -1).replace(/\\(["'])/g, '$1');
	}
	return str;
}

export function findHeader(css: string) {
	const header = findComment(css, '! ');
	expect(header, 'header comment not found').toBeTruthy();
	return header;
}

export function findDefaults(css: string) {
	const subhead = findComment(css, 'defaults: ');
	expect(subhead, 'subhead comment not found').toBeTypeOf('string');
	const list: string[] = (subhead ?? '').split(', ');
	return list.toSorted();
}

export function findArray(css: string, id = 'TEST'): string[] {
	const output = findOutput(css, id) ?? '';
	const data = JSON.parse(output.replace(/,\]$/, ']')) as string[];
	expect(data).toBeInstanceOf(Array);
	return data;
}

export function findOutput(css: string, id = 'TEST') {
	const output = findComment(css, `${id}: `);
	expect(output, `output for '${id}' not found`).toBeTruthy();
	return output;
}

function findComment(css: string, prefix: string) {
	const comments = parse(css).nodes.filter((node) => node.type == 'comment');
	for (const node of comments) {
		const text = node.text.trim();
		if (text.startsWith(prefix)) {
			return text.replace(prefix, '');
		}
	}
}
