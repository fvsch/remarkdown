# Limitations and known issues

ReMarkdown was tested on recent versions of modern browsers. It works well in
all browsers with complete CSS 2.1 support, including IE8. It will degrade
not-so-gracefully in IE7.

## Browser-specific issues

-   IE8 does not render generated content in HR elements. Your horizontal
    rules will be invisible in that browser.
-   IE8, in print mode, has trouble with the overflowing “>” signs of
    blockquotes.
-   Spotted a few issues when printing in Firefox 4b on OSX. I opened two
    bug reports and both were fixed (yay!), so Firefox 4 final should be ok.
-   Spotted a few minor issues when printing in Opera 11 on OSX.

## Underlined headings

To achieve the style of underlined H1 and H2 elements, I had to pick one of
the various CSS position schemes/behaviors/display modes/etc. that restrict
an element’s width to the width of its contents. All of the options I could
figure out had unwanted side effects. I settled for `display:inline-block`
but it’s far from a perfect solution. Two consequences:

1.  Spacing above and below titles may be off in a few configurations (issues
    caused by the lack of margin collapsing).
2.  Having two underlined headings in a row is dangerous. Typically, an
    underlined H2 following an underlined H1 might end up on the same line.
    So such H2 elements are switched back to `display:block` (a very dirty
    fix).

## Lists

-   Ordered lists use a custom CSS counter, not the default counter. Only way
    to change the counter style (from numeric to roman or something else) is
    to change the CSS for “remarkdowned” OLs.
-   The start attribute of OL elements is ignored. If you know a way to use
    it in a CSS counter, feel free to tell me.