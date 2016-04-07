'use strict';

var gulp = require('gulp');
var path = require('path');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var colors = require('colors');
var nodemon = require('gulp-nodemon');
var BUILD_DIR = 'build';
var TEMPLATES = path.join('demo/templates', 'index.jade');
var STYLES = path.join('demo/styles', 'styles.styl');
var SCRIPT = 'src/electric-slide.js';

/**
 * Set default gulp task as the build tasks
 */

gulp.task('default', ['build']);
gulp.task('build', ['templates', 'styles', 'scripts']);

/**
 * Assets
 */

gulp.task('templates', () => {
  console.log('Building templates...'.bgCyan);
  gulp.src(TEMPLATES)
    .pipe(jade())
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('styles', () => {
  console.log('Building styles...'.bgMagenta);
  gulp.src(STYLES)
    .pipe(stylus())
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('scripts', () => {
  console.log('Building scripts...'.bgWhite.black);
  gulp.src(SCRIPT).pipe(gulp.dest(BUILD_DIR));
});

/**
 * Server
 */

gulp.task('run', () => {
  nodemon({
    script: 'server.js'
  });
});

gulp.task('server', ['build', 'watch', 'run']);

// The Watcher
gulp.task('watch', () => {
  console.log('~=~=~=~=~=~ |∞|(º) Watching (º)|∞| ~=~=~=~=~=~'.bgYellow);
  gulp.watch(TEMPLATES, ['templates']);
  gulp.watch(STYLES, ['styles']);
  gulp.watch(SCRIPT, ['scripts']);
});