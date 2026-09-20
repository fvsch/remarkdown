import fs from 'node:fs';
import { expect, test } from 'vitest';

import { pkg, localPath, findHeader } from './helpers';

const expectedOutputs = [
	{
		path: 'dist/remarkdown.css',
		brand: 'Remarkdown',
		selector: '.remarkdown',
	},
	{
		path: 'dist/remarkdown.attr.css',
		brand: 'Remarkdown',
		selector: '[data-remarkdown]',
	},
	{
		path: 'dist/remarkdown-zero.css',
		brand: 'Remarkdown-zero',
		selector: '.remarkdown',
	},
	{
		path: 'dist/remarkdown-zero.attr.css',
		brand: 'Remarkdown-zero',
		selector: '[data-remarkdown]',
	},
];

const expectedSize = {
	low: 8_000,
	high: 14_000,
};

function findOutputs() {
	return fs.globSync('dist/*', { cwd: localPath() });
}

test('only expected stylesheets are present', () => {
	const expected = expectedOutputs.map((s) => s.path).toSorted();
	const files = findOutputs().toSorted();
	expect(files).toEqual(expected);
});

for (const { path, brand, selector } of expectedOutputs) {
	test(`${path}`, () => {
		const css = fs.readFileSync(localPath(path), { encoding: 'utf8' });

		expect(css.length).toBeGreaterThan(expectedSize.low);
		expect(css.length).toBeLessThan(expectedSize.high);

		const header = findHeader(css, true);
		expect(header).toMatch(`${brand} ${pkg.version}`);
		expect(header).toMatch(pkg.license);
		expect(header).toMatch(pkg.homepage);

		expect(css.split('\n').slice(2, 10).join('\n')).toMatch(selector);
	});
}
