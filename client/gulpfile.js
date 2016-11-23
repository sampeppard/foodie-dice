////////////////////// DEPENDENCIES AND VARIABLES //////////////////////
const gulp = require('gulp');

// used for concatenating/minifying bower files and other js/css
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
// used for pulling in bower files.
const lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});

// used for build and clean tasks.
const utilities = require('gulp-util');
const buildProduction = utilities.env.production;
const del = require('del');

// set up server with watchers and run typescript compiler in the shell.
const browserSync = require('browser-sync').create();

// sass dependencies.
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps'); //Required for both sass and ts

// typescript dependencies.
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const tslint = require('gulp-tslint');
const tsconfigGlob = require('tsconfig-glob');

////////////////////// TYPESCRIPT //////////////////////

// clean dist compiled ts task
gulp.task('distAppClean', function(){
  // delete all files in the distribution app directory
  return del('dist/app/*');
});

// update the tsconfig files based on the glob pattern
gulp.task('tsconfigGlob', ['distAppClean'], function () {
  return tsconfigGlob({
    configPath: '.',
    indent: 2
  });
});

// compile all files found in tsconfig.json
gulp.task('tsCompile', ['tsconfigGlob'], function() {
  // list of ts files added to tsconfig.json either by atom or gulp task
  return gulp
  .src(tscConfig.files)
  .pipe(sourcemaps.init())
  .pipe(typescript(tscConfig.compilerOptions))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist/app'));
});

// typescript linting
gulp.task('tslint', function() {
  return gulp
    .src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});


////////////////////// NODE_MODULES //////////////////////

// clean dist lib task
gulp.task('distLibClean', function(){
  // delete all files in the distribution lib directory
  return del('dist/lib/*');
});

// copy npm dependencies to dist/lib
gulp.task('copy:libs', ['distLibClean'], function() {
  return gulp
    .src([
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system.src.js',
    ])
    .pipe(gulp.dest('dist/lib'))
});


////////////////////// BOWER //////////////////////
// when adding a new bower dependency:
// stop the server
// always use the `bower install --save` flag.
// run `gulp bower` to build vendor files
// restart server.

// clean dist static task
gulp.task('distStaticClean', function(){
  // delete all files in the distribution static directory
  return del('dist/static/*');
});

gulp.task('jsBowerClean', function(){
  return del(['build/js/vendor.min.js']);
});

gulp.task('jsBower', ['jsBowerClean'], function() {
  return gulp
    .src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('cssBowerClean', function(){
  return del(['build/css/vendor.css']);
});

gulp.task('cssBower', ['cssBowerClean'], function() {
  return gulp
    .src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('build/css'));
});

// combine static files and make smaller and put the results in build, then
// copy static assets into dist
gulp.task('bower', ['jsBower', 'cssBower', 'distStaticClean'], function() {
  return gulp
    .src(['build/**/*'], { base : './' })
    .pipe(gulp.dest('dist/static'));
});


////////////////////// SASS //////////////////////

gulp.task('sassBuild', function() {
  return gulp
    .src(['resources/styles/*'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/css'));
});

////////////////////// SERVER //////////////////////
gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  gulp.watch(['resources/js/*.js'], ['jsBuild']); // vanilla js changes, reload.
  gulp.watch(['*.html'], ['htmlBuild']); // html changes, reload.
  gulp.watch(['resources/styles/*.css', 'resources/styles/*.scss'], ['cssBuild']); // css or sass changes, concatenate all css/sass, build, reload.
  gulp.watch(['app/*.ts'], ['tsBuild']); // typescript files change, compile then reload.
});

gulp.task('jsBuild', function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function(){
  browserSync.reload();
});

gulp.task('cssBuild', ['sassBuild'], function(){
  browserSync.reload();
});

gulp.task('tsBuild', ['tsCompile'], function(){
  browserSync.reload();
});

////////////////////// GLOBAL BUILD TASK //////////////////////
// global build task with individual clean tasks as dependencies.
gulp.task('build', function(){
  gulp.start('tsCompile');
  if (buildProduction) {
    //INITIALIZATION HERE
    gulp.start('bower');
    gulp.start('sassBuild');
    gulp.start('copy:libs');
  }
});
