# Remarkdown

Remarkdown makes HTML look like plain [Markdown][] text.

- Npm: [remarkdown.css](https://www.npmjs.com/package/remarkdown.css)
- Documentation:
	- [Using Remarkdown](https://fvsch.github.io/remarkdown/)
	- [Remarkdown styles](https://fvsch.github.io/remarkdown/styles)
	- [Configuring Remarkdown](https://fvsch.github.io/remarkdown/config)

## Usage with a CDN

Add a link to the `dist/remarkdown.css` stylesheet and `class="remarkdown"` on a container wrapping all the text you want to style: 

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

There are a few [alternate styles](https://fvsch.github.io/remarkdown/styles) you can pick from. For example, `class="remarkdown h1-line ul-star"` enables underlined `<h1>`s and asterisks for bullets.

The main `dist/remarkdown.css` stylesheet exists in a few variants, which tweak what CSS selectors look like and what styles are enabled by default:

- [remarkdown.css](): normal defaults, `.remarkdown` class.
- [remarkdown.scope.css](https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css): normal defaults, `.remarkdown` class using [CSS `@scope`][css-scope].
- 

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

See the [`preset` directory](https://github.com/fvsch/remarkdown/tree/main/preset) for some examples that modify the Remarkdown selectors, and [`lib/config/_defaults.scss`](https://github.com/fvsch/remarkdown/tree/main/lib/config/_defaults.scss) for all available configuration options.



[Markdown]: https://daringfireball.net/projects/markdown/
[Sass]: https://sass-lang.com/
[Vite]: https://vite.dev/
[css-scope]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope

[remarkdown.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css
[remarkdown.attr.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css
[remarkdown.scope.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css
[remarkdown.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css
[remarkdown.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css
[remarkdown.css]: https://cdn.jsdelivr.net/npm/remarkdown.css@4/dist/remarkdown.css
