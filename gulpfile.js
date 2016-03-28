/*
Sibling directory doesn't work. Will likely just ahave a repo and copy the few files into web root.
 */

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  changed = require('gulp-changed'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  include = require('gulp-include'),
  browsersync = require('browser-sync').create(),
  debug = require('gulp-debug'), //Not active use.
  paths = require('./gulp_paths.json'),
  miscPaths = require('./gulp_misc_paths.json');

var watcherArray = Object.keys(paths); //append as needed

gulp.task("sass", function(){
  return sass(paths.sass.in, {style : 'compressed', sourcemap : true})
  .on('error',sass.logError)
  .pipe(autoprefixer())
  .pipe(sourcemaps.write(miscPaths.maps))
  .pipe(gulp.dest(paths.sass.out))
  .pipe(browsersync.stream({match : miscPaths.notmaps}));
});

gulp.task("html", function(){
  gulp.src(paths.html.in)
    .pipe(changed(paths.html.out))
    .pipe(include())
    .pipe(gulp.dest(paths.html.out))
    .pipe(browsersync.stream());
});

gulp.task("js", function(){
    gulp.src(paths.js.in)
    .pipe(changed(paths.js.out))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .on('error',function(obj){
        gutil.log('ERROR',obj.message,"on line", obj.lineNumber);
      })
    .pipe(sourcemaps.write(miscPaths.maps))
    .pipe(gulp.dest(paths.js.out))
    .pipe(browsersync.stream({match : miscPaths.notmaps}));
});

gulp.task("misc", function(){
  gulp.src(paths.misc.in)
    .pipe(changed(paths.misc.out))
    .pipe(gulp.dest(paths.misc.out))
    .pipe(browsersync.stream());
});

gulp.task("img", function(){
  gulp.src(paths.img.in)
  .pipe(changed(paths.img.out))
  .pipe(gulp.dest(paths.img.out))
  .pipe(browsersync.stream());
});

gulp.task('watcher',watcherArray, function(){
  for(var key in paths){
    gulp.watch(paths[key].in, [key]);
  }
});

gulp.task('default', ['watcher'], function() {
  browsersync.init({ server: miscPaths.sync,open:false});
});