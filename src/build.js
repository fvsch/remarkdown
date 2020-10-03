const fs = require('fs')
const path = require('path')
const sass = require('sass')
const prettier = require('prettier')

const root = path.dirname(__dirname)

const sources = [
  ['src/remarkdown.scss', 'dist/remarkdown.css'],
  ['src/remarkdown.attr.scss', 'dist/remarkdown.attr.css'],
  ['src/remarkdown-zero.scss', 'dist/remarkdown-zero.css'],
  ['src/remarkdown-zero.attr.scss', 'dist/remarkdown-zero.attr.css'],
  ['src/remarkdown-custom.scss', 'dist/remarkdown-custom.css'],
  ['docs/demo.scss', 'docs/demo.css'],
]

sources.forEach(buildStylesheet)

function buildStylesheet([sourceFilename, outFilename]) {
  const sourceFile = path.join(root, sourceFilename)
  const outFile = path.join(root, outFilename)
  if (fs.existsSync(sourceFile) === false) {
    return
  }

  console.log('Compiling ' + sourceFile)
  sass.render({ file: sourceFile, outputStyle: 'expanded' }, (err, result) => {
    if (err) throw err
    const css = result.css.toString('utf8')
    const prettified = prettier.format(css, {
      parser: 'css',
      singleQuote: false,
    })
    fs.writeFile(outFile, prettified, (err) => {
      if (err) throw err
      console.log(`Writing ${outFile} (${prettified.length} bytes)`)
    })
  })
}
