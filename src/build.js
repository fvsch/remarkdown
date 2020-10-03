const fs = require('fs')
const path = require('path')
const sass = require('sass')
const prettier = require('prettier')

const sources = [
  'remarkdown.scss',
  'remarkdown.attr.scss',
  'remarkdown-zero.scss',
  'remarkdown-zero.attr.scss',
  'remarkdown-custom.scss',
]

sources.forEach(buildStylesheet)

function buildStylesheet(filename) {
  const source = path.join(__dirname, filename)
  if (fs.existsSync(source) === false) {
    return
  }
  const dest = source.replace('/src/', '/dist/').replace('.scss', '.css')

  console.log('Compiling ' + source)
  sass.render({ file: source, outputStyle: 'expanded' }, (err, result) => {
    if (err) throw err
    const css = result.css.toString('utf8')
    const prettified = prettier.format(css, {
      parser: 'css',
      singleQuote: false,
    })
    fs.writeFile(dest, prettified, (err) => {
      if (err) throw err
      console.log(`Writing ${dest} (${prettified.length} bytes)`)
    })
  })
}
