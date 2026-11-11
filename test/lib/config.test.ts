import { describe, test } from 'vitest';

import { expectScssExports } from '../shared';

describe('config namespace', () => {
	test('check exports', () => {
		expectScssExports('config', {
			functions: ['get', 'get-all', 'has-default', 'has-option', 'new'],
			mixins: ['set-all'],
			variables: [],
		});
	});
});
