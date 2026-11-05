import { type ChildNode, parse, Rule } from 'postcss';
import { expect } from 'vitest';

export function findHeader(css: string | undefined) {
	const title = findComment(css, '! ');
	expect(title, 'header title not found').toBeTypeOf('string');
	const defaults = findComment(css, 'default-styles: ');
	expect(defaults, 'default-styles list not found').toBeTypeOf('string');

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

export function getCssVars(css: string): string[] {
	const nodes = getNodes(css);
	const rules = getRules(nodes);
	return rules.flatMap((rule) => {
		return rule.nodes
			.filter((node) => node.type === 'decl' && node.prop.startsWith('--'))
			.map((node) => node.toString());
	});
}

export function getSelectors(css: string): string[] {
	const nodes = getNodes(css);
	const rules = getRules(nodes);
	return rules.map((node) => node.selector);
}

function getNodes(css: string): ChildNode[] {
	try {
		return parse(css).nodes;
	} catch {
		return [];
	}
}

function getRules(nodes: ChildNode[]): Rule[] {
	return nodes.flatMap((node) => {
		if (node.type === 'rule') {
			return node;
		} else if (node.type === 'atrule' && node.nodes) {
			return node.nodes.filter((n) => n.type === 'rule');
		}
		return [];
	});
}
