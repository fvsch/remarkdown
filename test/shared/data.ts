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

export const RMD_CONFIG_KEYS = [
	'selectors',
	'css-var',
	'defaults',
	'options',
	'font',
	'code-font',
	'line-height',
	'margins',
	'hn-prefix',
	'h1-line',
	'h2-line',
	'ul-dash',
	'ul-star',
	'ul-plus',
	'ol-mark',
	'pre-ticks',
	'pre-tilde',
	'pre-tilde-line',
	'quote-mark',
	'quote-rtl',
	'hr-stars',
	'hr-dashes',
	'table-vline',
	'table-hline',
];

export const RMD_ALL_STYLES = [
	'a-bracket',
	'a-showurl',
	'code-tick',
	'del-tilde',
	'em-reset',
	'em-star',
	'em-underscore',
	'font-reset',
	'h1-line',
	'h2-line',
	'hn-prefix',
	'hn-reset',
	'hr-center',
	'hr-dash',
	'hr-star',
	'ol-alpha',
	'ol-decimal',
	'ol-zero',
	'pre-indent',
	'pre-tick',
	'pre-tilde',
	'pre-tilde-full',
	'quote-mark',
	'strong-reset',
	'strong-star',
	'strong-underscore',
	'table-border',
	'table-border-full',
	'table-reset',
	'ul-dash',
	'ul-plus',
	'ul-star',
];

export const RMD_DEFAULTS = [
	'a-bracket',
	'code-tick',
	'em-reset',
	'em-star',
	'font-reset',
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

export const RMD_ZERO_DEFAULTS = ['em-reset', 'font-reset', 'hn-reset', 'strong-reset'];

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

export const CONFIG_EXPORTS: SassExportsKeys = {
	functions: ['base-config', 'get', 'get-margins', 'has-default', 'has-option', 'is-style'],
	mixins: ['set'],
	variables: [],
};

export const STYLES_EXPORTS: SassExportsKeys = {
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
