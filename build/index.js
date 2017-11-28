const fs = require('fs')
const glob = require('glob')
const path = require('path')
const sass = require('node-sass')

for (let source of glob.sync(path.join(__dirname, '/*.scss'))) {
  const dest = source.replace('/build/', '/dist/').replace('.scss', '.css')
  console.log('Compiling ' + source)
  sass.render(
    {file: source, outputStyle: 'expanded'},
    (err, result) => {
      if (err) throw err
      fs.writeFile(dest, result.css, err => {
        if (err) throw err
        console.log('Wrote ' + dest)        
      })
    }
  )
}
