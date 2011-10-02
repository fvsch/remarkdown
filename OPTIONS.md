# Options and other technical details

You can trigger a number of options using specific classes. You can declare
those classes on the same element you used to declare `rmd-on`, on
sub-containers, or on the targetted elements themselves. The stylesheet is
rather flexible.

## Available options

-   `rmd-h1-uppercase`: uppercase H1.
-   `rmd-h1-underline`: add a line of “=” signs to H1.
-   `rmd-h2-underline`: add a line of “-” signs to H2.
-   `rmd-em-star: use “*” signs for emphasis (default).
-   `rmd-em-underscore`: use “_” signs for emphasis.
-   `rmd-strong-star`: use “*” signs for strong emphasis (default).
-   `rmd-strong-underscore`: use “_” signs for strong emphasis.
-   `rmd-a-bracket`: add square brackets around links.
-   `rmd-a-showurl`: show URLs after links (on screen and in print).
-   `rmd-a-printurl`: show URLs after links when printing. No need to use
    this if you’re already using the “showurl” option.
-   `rmd-a-printref`: print URLs with reference numbers at the end of the
    container. Don’t use this together with the “showurl” and “printurl”
    options. Requires JS, see below.
-   `rmd-ul-star`: use “*” for bullets (default).
-   `rmd-ul-plus`: use “+” for bullets.
-   `rmd-ul-minus`: use “-” for bullets.
-   `rmd-hr-star`: use “*” signs for HR (default).
-   `rmd-hr-minus`: use “-” signs for HR.
-   `rmd-hr-center`: center the horizontal rule.

Important notes on option classes:

1. Words in the class name are always singular: “bracket”, not “brackets”.
2. Each option class has an equivalent which can be used on the affected
   element itself, and which omits the element name, e.g. `rmd-underscore` on
   strong elements, `rmd-showurl` on links, etc.

Note that the `rmd-a-printref` option needs the `rmd-print.js` script. The
script generates an invisible list of URLs at the end of each container with
this class, and the print styles reveal this list when printing the page.

## Example code

    <!doctype html>
    <html lang="en">
    <head>
      <title>Using ReMarkdown</title>
      <link rel="stylesheet" href="remarkdown.css">
    </head>
    <body>
    <nav>
      Site navigation
    </nav>
    <article class="rmd-on rmd-h1-underline rmd-link-footnote rmd-hr-center">
      <h1 class="rmd-uppercase">Hello World</h1>
      <p>Goodnight, and <a href="/l/">good luck</a>.</p>
      <hr>
      <p>More content.</p>
    </article>
    <script src="rmd-print.js"></script>
    </body>
    </html>

For more examples of how you can use ReMarkdown classes, see the sampler page
and take a look at the source code. Note that it’ll probably be easier to set
all option classes on one container element, rather than on individual
elements.

## How does it work exactly?

The gist of it:

-   The stylesheet sets everything to the same monospace font, font size and
    line height.
-   Then it adds text markers at the start and end of elements, in `:before`
    and `:after` pseudo-elements.

There are a few special cases, such as underlined titles, block quotes,
ordered lists, and print styles for links. Do read `remarkdown.css` if you
speak CSS and want to know more.

Note that there is a number of known issues.