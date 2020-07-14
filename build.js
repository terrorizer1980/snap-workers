const fs = require('fs')
const browserify = require('browserify')
const watchify = require('watchify')

let watch = false
if (process.argv.length > 2) {
  watch = Boolean(process.argv[2])
}

const browserifyOpts = {
  debug: false,
  entries: ['src/pluginWorker.js'],
}

if (watch) {
  browserifyOpts.cache = {}
  browserifyOpts.packageCache = {}
  browserifyOpts.plugin = [watchify]
}

const b = browserify(browserifyOpts)
  .transform('uglifyify', { global: true })

if (watch) {
  b.on('update', bundle)
    .on('log', console.log)
}

bundle()

function bundle () {
  b.bundle()
    .on('error', console.error)
    .pipe(fs.createWriteStream('dist/pluginWorker.js'))
}
