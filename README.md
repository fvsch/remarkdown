# ReMarkdown — Display HTML as Markdown text

ReMarkdown is a CSS experiment and reusable stylesheet for displaying simple HTML text as its Markdown equivalent. To get a feel of what it does, look at [this page and its HTML source][CPINFO_RMD].

## What’s the point?

Well, if you love Markdown, or want your simple HTML pages to look deceptively
like good old plain text, the remarkdown.css stylesheet is for you!

I don’t really expect this stylesheet to be widely used, and don’t even know
if I’ll use it myself. But it was a nice CSS challenge to work on: no
background images, no borders, only plain text characters.

## Browser support

All modern, CSS 2.1-compliant browsers should handle these styles with ease.
There might be minor issues on IE8. IE7 is not supported.

## Basic usage

An example HTML page using ReMarkdown would look like this:

    <!doctype html>
    <html lang="en">
    <head>
      <title>Using ReMarkdown</title>
      <link rel="stylesheet" href="remarkdown.css">
    </head>
    <body class="rmd-on">
      <h1>Hello World</h1>
      <p>Goodnight, and good luck.</p>
    </body>
    </html>

You will need to download a copy of `remarkdown.css`, and put it in the same
directory as your HTML page. Note that we need to declare the `rmd-on` class
somewhere in the document: on the `body element, on a container `article` or
`div` element, your call.

See `OPTIONS.md` and `ISSUES.md` for details.

## Copyright and stuff

Both `remarkdown.css` and the optional script `rmd-print.js` are free software under the [DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE][WTFPL].

[CPINFO_RMD]: http://fvsch.com/code/remarkdown/
[WTFPL]: http://fvsch.com/code/remarkdown/COPYING
