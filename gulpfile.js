/**
 * @file
 * Provides Gulp configurations and tasks for Bootstrap for Drupal theme.
 */

'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
// const sass = require('gulp-sass');
var sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const globbing = require('gulp-css-globbing');


// CSS task
function sass2css() {
  return gulp
  .src('./src/sass/*.scss')
  .pipe(globbing({
    extensions: ['.scss']
  }))
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(gulp.dest('./src/css'))
  .pipe(browserSync.stream())
}

// Watch files
function watchFiles() {
  browserSync.init({
    open: false,
    server: "./src/sass/**/*.scss"
  });

  gulp
   .watch("./src/sass/**/*.scss", sass2css)
   .on('change', browserSync.reload);
}

const watch = gulp.series(watchFiles);

// export tasks

exports.default = watch;
