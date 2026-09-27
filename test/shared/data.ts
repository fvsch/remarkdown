export const DIST_STYLESHEETS = [
	{
		path: 'dist/remarkdown.css',
		brand: 'Remarkdown',
		selector: '.remarkdown',
		size: [8_000, 12_000],
	},
	{
		path: 'dist/remarkdown.attr.css',
		brand: 'Remarkdown',
		selector: '[data-remarkdown]',
		size: [10_000, 14_000],
	},
	{
		path: 'dist/remarkdown-zero.css',
		brand: 'Remarkdown-zero',
		selector: '.remarkdown',
		size: [8_000, 12_000],
	},
	{
		path: 'dist/remarkdown-zero.attr.css',
		brand: 'Remarkdown-zero',
		selector: '[data-remarkdown]',
		size: [10_000, 14_000],
	},
];

export const RMD_DEFAULTS = [
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
];

export const RMD_ZERO_DEFAULTS = ['base-text', 'em-reset', 'hn-reset', 'strong-reset'];

type SassExportsKeys = {
	functions: string[];
	mixins: string[];
	variables: string[];
};

export const RMD_EXPORTS: SassExportsKeys = {
	functions: [],
	mixins: ['config', 'header', 'styles'],
	variables: ['url', 'version'],
};

export const RMD_CONFIG_EXPORTS: SassExportsKeys = {
	functions: ['base', 'get', 'get-all', 'has-default', 'has-option'],
	mixins: ['set'],
	variables: [],
};

export const RMD_STYLES_EXPORTS: SassExportsKeys = {
	functions: [],
	mixins: [
		'base',
		'code',
		'del',
		'em',
		'figure',
		'heading',
		'hr',
		'link',
		'ol',
		'p',
		'pre',
		'quote',
		'strong',
		'table',
		'ul',
		'vars',
	],
	variables: [],
};
