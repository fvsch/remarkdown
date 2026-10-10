import { join } from 'node:path';

import packageJson from '../../package.json' with { type: 'json' };

const rootDir = join(import.meta.dirname, '..', '..');

export const pkg = packageJson;

export function localPath(subPath?: string) {
	return subPath ? join(rootDir, subPath) : rootDir;
}
