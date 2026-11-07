import { describe, test } from 'vitest';

import { CONFIG_EXPORTS } from '../data';
import { scssExportsTest } from '../shared';

describe('config namespace', () => {
	test('check exports', scssExportsTest('config', CONFIG_EXPORTS));
});
