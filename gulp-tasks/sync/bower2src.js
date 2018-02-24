/*!
 * Project:     roulette-predictor
 * File:        ./gulp-tasks/sync/bower2src.js
 * Copyright(c) [2018-present] <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const fs   = require('fs');
const path = require('path');
const util = require('util');
const utin = util.inspect;

const gulpif    = require('gulp-if');
const cleanCSS  = require('gulp-clean-css');
const changed   = require('gulp-changed');
const filter    = require('gulp-filter');
const uglify    = require('gulp-uglify');
const rename    = require('gulp-rename');
const mainBower = require('main-bower-files');
const merge     = require('merge-stream');

//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

let ME = global.ME || {};

const modName = path.basename(module.filename, '.js');
const modPath = path.relative(ME.WD, path.dirname(module.filename));

const modConfigFile = `config/${path.join(modPath, modName)}.json`;
const modConfig = require('read-config')(modConfigFile);

//  ------------------------------------------------------------------------  //
//  -------------------------------  EXPORTS  ------------------------------  //
//  ------------------------------------------------------------------------  //

module.exports = function (gulp) {
  console.log(`[${new Date().toISOString()}][${modPath}/${modName}] ACTIVATED with modConfig = [${utin(modConfig)}]`);

  let mBower = mainBower(ME.pkg.options.bower, {
      base:  ME.BOWER
    , group: ['front']
  });

  let DEST = path.join(ME.BUILD, 'assets');
  let KEEP = path.join(ME.BUILD, 'resources/assets');
  let JS   = path.join('js/lib');
  let CSS  = path.join('css');
  let FONT = path.join('fonts');
  let IMG  = path.join('img');

  let bowerJS = gulp.src(mBower)
    .pipe(filter([
        '**/*.js'
      , '!**/*.min.js'
      , '!**/npm.js'
    ]))
    .pipe(gulp.dest(path.resolve(KEEP, JS)))
    .pipe(gulpif('production' === ME.NODE_ENV, uglify(), false))
    .pipe(gulpif('production' === ME.NODE_ENV, rename({suffix: ME.pkg.options.minify.suffix})))
    .pipe(gulp.dest(path.resolve(DEST, JS)));

  let bowerCSS = gulp.src(mBower)
    .pipe(filter([
        '**/*.css'
      , "!**/*.css.map"
      , '!**/*.min.css'
    ]))
    .pipe(gulp.dest(path.resolve(KEEP, CSS)))
    .pipe(gulpif('production' === ME.NODE_ENV, cleanCSS(ME.pkg.options.clean, function (d) {
      console.info(d.name + ':\t' + d.stats.originalSize + '\t->\t' + d.stats.minifiedSize + '\t[' + d.stats.timeSpent + 'ms]\t[' + 100 * d.stats.efficiency.toFixed(2) + '%]');
    }), false))
    .pipe(gulp.dest(path.resolve(DEST, CSS)));

  let bowerFonts = gulp.src(mBower)
    .pipe(filter(['**/fonts/*.*']))
    .pipe(changed(path.resolve(KEEP, FONT)))
    .pipe(gulp.dest(path.resolve(KEEP, FONT)))
    .pipe(gulp.dest(path.resolve(DEST, FONT)));

  let bowerImg = gulp.src(mBower)
    .pipe(filter([
        '**/img/*.*'
      , '**/image/*.*'
      , '**/images/*.*'
    ]))
    .pipe(filter([
        '**/*.png'
      , '**/*.jpg'
      , '**/*.jpeg'
      , '**/*.gif'
      , '**/*.ico'
    ]))
    .pipe(changed(path.join(KEEP, IMG)))
    .pipe(gulp.dest(path.join(KEEP, IMG)))
    .pipe(gulp.dest(path.join(DEST, IMG)));

  return merge(bowerJS, bowerCSS, bowerFonts, bowerImg);

};
