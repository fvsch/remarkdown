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

export function compileScss(scss: string) {
	const loadPaths = [rootDir];
	const prefix = `@use "./lib/rmd" as rmd;\n`;
	const result = compileString(prefix + scss, { loadPaths });
	return result.css;
}

export function findHeader(css: string, assert = false) {
	const header = findComment(css, '! ');
	if (assert) expect(header, 'header comment not found').toBeTruthy();
	return header;
}

export function findSubhead(css: string, assert = false) {
	const subhead = findComment(css, 'defaults: ');
	if (assert) expect(subhead, 'subhead comment not found').toBeTruthy();
	return subhead;
}

function findComment(css: string, prefix: string) {
	for (const node of parse(css).nodes) {
		if (node.type == 'comment' && node.text.trim().startsWith(prefix)) {
			return node.text.trim().replace(prefix, '');
		}
	}
}
