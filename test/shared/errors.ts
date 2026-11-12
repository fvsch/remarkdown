import { ALL_STYLES, DEFAULTS } from './data';
import { formatStringList } from './scss';

export function unknownOption(option: string) {
	const list = formatStringList(Object.keys(DEFAULTS));
	return `Unknown option $${option}, expected one of ${list}`;
}

export function unknownStyle(option: 'default-styles' | 'optional-styles', name: string) {
	const list = formatStringList(ALL_STYLES);
	return `$${option} has unknown style name "${name}", expected one of ${list}`;
}
