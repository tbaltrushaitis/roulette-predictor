/*!
 * Project:     roulette-predictor
 * File:        ./gulp-tasks/sync/src2build.js
 * Copyright(c) [2018-present] <tbaltrushaitis@gmail.com>
 * License:     MIT
 */

'use strict';

//  ------------------------------------------------------------------------  //
//  -----------------------------  DEPENDENCIES  ---------------------------  //
//  ------------------------------------------------------------------------  //

const path = require('path');
const util = require('util');
const utin = util.inspect;

const dirSync = require('gulp-directory-sync');

/**
 * CONFIGURATION
 */

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

  return  gulp.src('')
            .pipe(dirSync(ME.SRC, ME.BUILD, ME.pkg.options.sync))
            .on('error', console.error.bind(console));

};
