# Remarkdown

Remarkdown is CSS that makes HTML look like plain [Markdown][] text.

- Documentation: [About](https://fvsch.github.io/remarkdown/) | [Styles](https://fvsch.github.io/remarkdown/styles) | [Config](https://fvsch.github.io/remarkdown/config)
- Npm package: [remarkdown.css](https://www.npmjs.com/package/remarkdown.css)

## Usage with a CDN

1. Add a link to [`dist/remarkdown.css`](https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css);
2. Put `class="remarkdown"` on a container with all the text you want to style.

```html
<!doctype html>
<html lang="en">
<head>
	<title>Using Remarkdown</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css">
</head>
<body class="remarkdown">
	<h1>Hello World</h1>
	<p>A paragraph.</p>
</body>
</html>
```

This will render text in monospace and add some Markdown-like syntax around elements.

You can choose [optional styles](https://fvsch.github.io/remarkdown/styles) if you don’t love the defaults. For example, `class="remarkdown h1-line ul-star"` enables underlined `<h1>`s and asterisks for bullets.

The pre-built Remarkdown stylesheet comes in a few variants, which change: what default styles are enabled; how optional styles are declared in HTML:

- [remarkdown.css][]: normal defaults, `class="remarkdown style-1 style-2"`.
- [remarkdown.attr.css][]: normal defaults, `data-remarkdown="style-1 style-2"`.
- [remarkdown-zero.css][]: resets only, `class="remarkdown style-1 style-2"`.
- [remarkdown-zero.attr.css][]: resets only, `data-remarkdown="style-1 style-2"`.

## Usage with npm

```sh
npm install remarkdown.css
```

When using a Bundler like [Vite][], you should be able to import pre-built stylesheets from the package’s `dist` directory in your own CSS:

```css
@import "remarkdown.css/dist/remarkdown.css";
/* or "remarkdown.css/dist/remarkdown-zero.attr.css", etc. */
```

Beyond the pre-built stylesheets, Remarkdown is a [Sass][] library, and can be imported with `@use` then configured with the `config()` mixin:

```scss
@use "pkg:remarkdown.css" as rmd;

// Configure a custom Remarkdown build
@include rmd.config($line-height: 1.75);

// Generate styles
@include rmd.header();
@include rmd.styles();
```

See the [`build` directory](https://github.com/fvsch/remarkdown/tree/main/build) for some examples that modify the Remarkdown selectors, and [`lib/_defaults.scss`](https://github.com/fvsch/remarkdown/tree/main/lib/_defaults.scss) for all available configuration options.


[Markdown]: https://daringfireball.net/projects/markdown/
[Sass]: https://sass-lang.com/
[Vite]: https://vite.dev/

[remarkdown.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css
[remarkdown.attr.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.attr.css
[remarkdown-zero.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown-zero.css
[remarkdown-zero.attr.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown-zero.attr.css
