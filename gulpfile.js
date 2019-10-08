const { src, dest, watch, series } = require('gulp'),
  browsersync = require('browser-sync').create(),
  include = require('gulp-include'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-terser'),
  notify = require('gulp-notify'),
  autoprefixer = require('gulp-autoprefixer'),
  gulpsass = require('gulp-sass'),
  sasspartials = require('gulp-sass-partials-imported'),
  changed = require('gulp-changed');

gulpsass.compiler = require('node-sass');


const paths = require('./gulp_paths.json'),
  miscPaths = require('./gulp_misc_paths.json');

function html() {
  return src(paths.html.in)
    .pipe(changed(paths.html.out))
    .pipe(include())
    .pipe(dest(paths.html.out))
    .pipe(browsersync.stream());
}

function img() {
  return src(paths.img.in)
    .pipe(changed(paths.img.out))
    .pipe(dest(paths.img.out))
    .pipe(browsersync.stream());
}

function js() {
  return src(paths.js.in)
    .pipe(changed(paths.js.out))
    .pipe(include()) // Uglify mucks up the sourcemaps when included files part of the sourcemap.
    // https://github.com/terinjokes/gulp-uglify/issues/105
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .on('error', notify.onError(function(obj) {
      return `${obj.message} line ${obj.lineNumber}`;
    }))
    .pipe(sourcemaps.write(miscPaths.maps))
    .pipe(dest(paths.js.out))
    .pipe(browsersync.stream({ match: miscPaths.notmaps }));
}

function misc() {
  return src(paths.misc.in)
    .pipe(changed(paths.misc.out))
    .pipe(dest(paths.misc.out))
    .pipe(browsersync.stream());
}

function sass() {
  return src(paths.sass.in)
    .pipe(changed(paths.sass.out,{extension:'.css'}))
    .pipe(sasspartials(miscPaths.sasspartials, miscPaths.sassinc))
    .pipe(gulpsass({
      outputStyle: 'compressed',
      onError: (err)=>{
        console.log({err});
      }
    }))
    .pipe(gulpsass().on('error', gulpsass.logError))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(miscPaths.maps))
    .pipe(dest(paths.sass.out))
    .pipe(browsersync.stream({ match: miscPaths.notmaps }));
}

function inc() {
  return src(paths.html.in)
    .pipe(include())
    .pipe(dest(paths.html.out))
    .pipe(browsersync.stream());
}

const methods = { html, img, js, misc, sass, inc }

function init(cb) {
  for (let key in methods) {
    methods[key].call();
  }
  cb();
}

function watcher(cb) {
  const keys = Object.keys(paths);

  keys.map(key => {
    watch(paths[key].in, methods[key])
  });

  cb();
}

function sync(cb) {
  browsersync.init({ server: miscPaths.sync, open: false, extensions:'html' });
  cb();
}

exports.sass = sass
exports.js = js
exports.watcher = watcher
exports.html = html
exports.default = series(init, watcher, sync);