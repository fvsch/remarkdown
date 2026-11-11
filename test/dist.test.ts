import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

import { DIST_STYLESHEETS } from './data';
import { expectLineCount, getHeader, getSelectors, localPath, pkg } from './shared';

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
