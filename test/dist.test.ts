import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

import { expectLineCount, getHeader, getSelectors, localPath, pkg } from './shared';

export const DIST_STYLESHEETS = [
	{
		path: 'dist/remarkdown.css',
		lines: 400,
		brand: 'Remarkdown',
		h1Selector: 'h1::before',
	},
	{
		path: 'dist/remarkdown.attr.css',
		lines: 440,
		brand: 'Remarkdown',
		h1Selector: '[data-remarkdown] h1::before',
	},
	{
		path: 'dist/remarkdown-zero.css',
		lines: 420,
		brand: 'Remarkdown-zero',
		h1Selector: ':scope.hn-prefix h1::before',
	},
	{
		path: 'dist/remarkdown-zero.attr.css',
		lines: 460,
		brand: 'Remarkdown-zero',
		h1Selector: '[data-remarkdown~="hn-prefix"] h1::before',
	},
];

describe('dist/*css', () => {
	test('only expected stylesheets are present', () => {
		const expected = DIST_STYLESHEETS.map((s) => s.path).toSorted();
		const files = fs.globSync('dist/*', { cwd: localPath() }).toSorted();
		expect(files).toEqual(expected);
	});

	for (const { path, lines, brand, h1Selector } of DIST_STYLESHEETS) {
		test(`${path}`, () => {
			const css = fs.readFileSync(localPath(path), { encoding: 'utf8' });

			// stylesheet size is roughly correct
			expectLineCount(css, lines);

			const { title } = getHeader(css);
			expect(title).toMatch(`${brand} ${pkg.version}`);
			expect(title).toMatch(pkg.license);
			expect(title).toMatch(pkg.homepage);

			const h1Selectors = getSelectors(css).filter((s) => /\bh1\b/.test(s));
			expect(h1Selectors).toContain(h1Selector);
		});
	}
});
