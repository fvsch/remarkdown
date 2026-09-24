import { expect, test } from 'vitest';

import { compileScss, findHeader, findSubhead, pkg } from './helpers';

test('outputs correct package version', () => {
	const css = compileScss(`@include rmd.header();`);
	const header = findHeader(css, true);

	expect(header).toBe(`Remarkdown ${pkg.version} (${pkg.license}) ${pkg.homepage}`);
});

test('outputs list of default styles', () => {
	const css = compileScss(`@include rmd.header();`);
	const subhead = findSubhead(css, true);

	const list = subhead?.split(', ').toSorted();
	expect(list).toEqual([
		'a-bracket',
		'base-text',
		'code-tick',
		'em-reset',
		'em-star',
		'hn-prefix',
		'hn-reset',
		'hr-star',
		'ol-decimal',
		'pre-indent',
		'quote-mark',
		'strong-reset',
		'strong-star',
		'ul-dash',
	]);
});
