import { parse } from 'postcss';
import { expect } from 'vitest';

export function findHeader(css: string | undefined) {
	const title = findComment(css, '! ');
	expect(title, 'header title not found').toBeTypeOf('string');
	const defaults = findComment(css, 'defaults: ');
	expect(defaults, 'header defaults list not found').toBeTypeOf('string');

	return {
		title,
		defaults: splitDefaults(defaults),
	};
}

function splitDefaults(input: string | undefined) {
	if (!input) return [];
	return input
		.split(',')
		.map((s) => s.trim())
		.toSorted();
}

function findComment(css: string | undefined, prefix: string) {
	if (!css) return;
	try {
		const comments = parse(css).nodes.filter((node) => node.type == 'comment');
		for (const node of comments) {
			const text = node.text.trim();
			if (text.startsWith(prefix)) {
				return text.replace(prefix, '');
			}
		}
	} catch {}
}
