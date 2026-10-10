import fs from 'node:fs';
import { Window } from 'happy-dom';
import { describe, expect, test } from 'vitest';

import { localPath, RMD_ALL_STYLES } from './shared';

describe('docs', () => {
	test('styles page lists all styles', () => {
		const document = getDocument('styles');

		const h1 = document.querySelector('h1');
		expect(h1).not.toBe(null);
		expect(h1!.textContent).toMatch('Remarkdown styles');

		const toc = document.querySelector('#styles-list');
		expect(toc).not.toBe(null);

		const list = [...toc!.querySelectorAll('tbody td:first-child')]
			.map((el) => el.textContent)
			.toSorted();
		expect(list).toEqual(RMD_ALL_STYLES);
	});

	test('styles page toc links to existing elements', () => {
		const document = getDocument('styles');

		const toc = document.querySelector('#styles-list');
		expect(toc).not.toBe(null);
		const links = [...toc!.querySelectorAll('tbody td:first-child a')];
		expect(links.length).toBeGreaterThanOrEqual(RMD_ALL_STYLES.length);

		for (const link of links) {
			const href = link.getAttribute('href') ?? '';
			expect(href).toMatch(/^#[a-z-]+$/);
			const target = document.querySelector(href);
			expect(target).not.toBe(null);
			expect(target!.tagName).toBeOneOf(['A', 'H2', 'H3']);
		}
	});
});

type DocPage = 'index' | 'styles' | 'config';

function getDocument(page: DocPage) {
	const html = getHtml(page);
	const url = `http://localhost:8080/${page === 'index' ? '' : page}`;
	const window = new Window({ url });
	return new window.DOMParser().parseFromString(html, 'text/html');
}

function getHtml(page: DocPage) {
	return fs.readFileSync(localPath(`docs/${page}.html`), { encoding: 'utf8' });
}
