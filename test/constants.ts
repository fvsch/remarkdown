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

export const RMD_STYLE_DEFAULTS = [
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

export const RMD_STYLE_ZERO = ['base-text', 'em-reset', 'hn-reset', 'strong-reset'];

export const RMD_MIXINS = [
	'config',
	'header',
	'styles',
	'styles-base',
	'styles-code',
	'styles-del',
	'styles-em',
	'styles-figure',
	'styles-heading',
	'styles-hr',
	'styles-link',
	'styles-ol',
	'styles-p',
	'styles-pre',
	'styles-quote',
	'styles-strong',
	'styles-table',
	'styles-ul',
	'styles-vars',
];

export const RMD_VARIABLES = ['url', 'version'];
