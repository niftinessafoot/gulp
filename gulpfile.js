var gulp = require('gulp'),
  gutil = require('gulp-util'),
  notify = require('gulp-notify'),
  changed = require('gulp-changed'),
  sass = require('gulp-ruby-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  include = require('gulp-include'),
  browsersync = require('browser-sync').create(),
  debug = require('gulp-debug'); //Not active use.

var paths = require('./gulp_paths.json'),
  miscPaths = require('./gulp_misc_paths.json'),
  watcherArray = Object.keys(paths), //append as needed
  localPath = process.env.PWD,
  localConfig = {};

var flags = {
  needsBabel : false
};

try{
  localConfig = require(localPath + '/gulpConfig.json');
}
catch(e){
  gutil.log("No local config.");
}

for (var key in flags){
  if(localConfig.hasOwnProperty(key)){
    flags[key] = localConfig[key];
  }
}

gutil.log(flags);

gulp.task("sass", function(){
  return sass(paths.sass.in, {style : 'compressed', sourcemap : true})
  .on('error',sass.logError)
  .pipe(autoprefixer())
  .pipe(sourcemaps.write(miscPaths.maps))
  .pipe(gulp.dest(paths.sass.out))
  .pipe(browsersync.stream({match : miscPaths.notmaps}));
});

gulp.task("sass_inc", function(){
  return sass('src/inc/**/*.scss', {style : 'compressed'})
  .on('error',sass.logError)
  .pipe(autoprefixer())
  .pipe(gulp.dest('src/inc'));
});

gulp.task("html", function(){
  gulp.src(paths.html.in)
    .pipe(changed(paths.html.out))
    .pipe(include())
    .pipe(gulp.dest(paths.html.out))
    .pipe(browsersync.stream());
});

gulp.task("inc",['sass_inc'], function(){
  //Same as HTML, but does not call `changed`—picks up all include file updates.
  gulp.src(paths.html.in)
    .pipe(include())
    .pipe(gulp.dest(paths.html.out))
    .pipe(browsersync.stream());
});

gulp.task("js", function(){
    gulp.src(paths.js.in)
    .pipe(changed(paths.js.out))
    // .pipe(include()) // Uglify mucks up the sourcemaps when included files part of the sourcemap.
                     // https://github.com/terinjokes/gulp-uglify/issues/105
    .pipe(sourcemaps.init({loadMaps : true}))
    // .pipe(uglify()) //does not support ES6. Find a fix
    .on('error',notify.onError(function(obj){
        return obj.message + " line " + obj.lineNumber;
      }))
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