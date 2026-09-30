import fs from 'node:fs';
import { expect, test } from 'vitest';

import { DIST_STYLESHEETS } from './shared/data';
import { pkg, localPath, findHeader } from './shared/helpers';

test('only expected stylesheets are present', () => {
	const expected = DIST_STYLESHEETS.map((s) => s.path).toSorted();
	const files = fs.globSync('dist/*', { cwd: localPath() }).toSorted();
	expect(files).toEqual(expected);
});

for (const { path, brand, selector, size } of DIST_STYLESHEETS) {
	test(`${path}`, () => {
		const css = fs.readFileSync(localPath(path), { encoding: 'utf8' });

		expect(css.length).toBeGreaterThan(Math.min(...size));
		expect(css.length).toBeLessThan(Math.max(...size));

		const header = findHeader(css);
		expect(header).toMatch(`${brand} ${pkg.version}`);
		expect(header).toMatch(pkg.license);
		expect(header).toMatch(pkg.homepage);

		expect(css.split('\n').slice(2, 10).join('\n')).toMatch(selector);
	});
}
