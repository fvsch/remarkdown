import { join } from 'node:path';
import { parse } from 'postcss';
import { compileString } from 'sass';
import { expect } from 'vitest';

import packageJson from '../package.json' with { type: 'json' };

const rootDir = join(import.meta.dirname, '..');

export const pkg = packageJson;

export function localPath(subPath?: string) {
	return subPath ? join(rootDir, subPath) : rootDir;
}

export const scss = (strings: string | TemplateStringsArray, ...values: any[]) => {
	if (typeof strings === 'string') {
		return compileScss(strings);
	}
	return compileScss(String.raw({ raw: strings }, ...values));
};

function compileScss(scss: string) {
	const loadPaths = [rootDir];
	const fullScss = `
	@use "sass:list";
	@use "sass:map";
	@use "sass:meta";
	@use "./lib/rmd" as rmd;
	@use "./test/helpers" as test;
	${scss}
	`;
	const result = compileString(fullScss, { loadPaths });
	return result.css;
}

export function findHeader(css: string, assert = false) {
	const header = findComment(css, '! ');
	if (assert) expect(header, 'header comment not found').toBeTruthy();
	return header;
}

export function findDefaults(css: string, assert = false) {
	const subhead = findComment(css, 'defaults: ');
	if (assert) {
		expect(subhead, 'subhead comment not found').toBeTypeOf('string');
	}
	const list: string[] = subhead?.split(', ') ?? [];
	return list.toSorted();
}

export function findOutput(css: string, assert = false) {
	const output = findComment(css, 'TEST: ');
	if (assert) expect(output, 'test output not found').toBeTruthy();
	return output;
}

function findComment(css: string, prefix: string) {
	for (const node of parse(css).nodes) {
		if (node.type == 'comment' && node.text.trim().startsWith(prefix)) {
			return node.text.trim().replace(prefix, '');
		}
	}
}
