/*!
 * Project:     roulette-predictor
 * File:        ./gulpfile.js
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

const _          = require('lodash');
const argv       = require('yargs').argv;
const parseArgs  = require('minimist');
const vinylPaths = require('vinyl-paths');
const dateFormat = require('dateformat');

const gulp      = require('gulp');
const changed   = require('gulp-changed');
const gulpTasks = require('gulp-require-tasks');


//  ------------------------------------------------------------------------  //
//  ----------------------------  CONFIGURATION  ---------------------------  //
//  ------------------------------------------------------------------------  //

global.ME = {};

const appPath  = __dirname;
const modName  = path.basename(module.filename, '.js');
const modPath  = path.relative(appPath, path.dirname(module.filename));
const modsPath = path.join(appPath, 'modules', path.sep);

const Config = require('config');
const pkg    = require('./package.json');

ME.Config = Config;

ME.pkg      = _.extend({}, pkg);
ME.version  = ME.pkg.version;
ME.NODE_ENV = argv.env
                ? argv.env
                : fs.existsSync('./NODE_ENV')
                  ? fs.readFileSync('./NODE_ENV', ME.pkg.options.file).split('\n')[0].trim()
                  : ME.NODE_ENV;

ME.VERSION = fs.existsSync('./VERSION') ? fs.readFileSync('./VERSION', ME.pkg.options.file).trim() : 'VERSION_UNKNOWN';
ME.COMMIT  = fs.existsSync('./COMMIT') ? fs.readFileSync('./COMMIT',  ME.pkg.options.file).trim() : 'COMMIT_UNKNOWN';

ME.CR  = '\n';
ME.DIR = {};
ME.WD  = path.join(__dirname, path.sep);
ME.DOC = path.join('docs',    path.sep);

ME.TMP    = path.join('tmp',                 path.sep);
ME.SRC    = path.join('src',                 path.sep);
ME.BUILD  = path.join(`build-${ME.VERSION}`, path.sep);
ME.DIST   = path.join(`dist-${ME.VERSION}`,  path.sep);
ME.WEB    = path.join(`webroot`,             path.sep);
ME.CURDIR = path.join(process.cwd(),         path.sep);
ME.BOWER  = JSON.parse(
              fs.existsSync('./.bowerrc')
                ? fs.readFileSync('./.bowerrc')
                : {directory: 'bower_modules'}
            ).directory;

utin.defaultOptions = _.extend({}, ME.pkg.options.iopts);

let now = new Date();
let headerTpl = _.template(`/**
 * @project: <%= pkg.title %> - <%= pkg.description %>
 * @package: <%= pkg.name %>@<%= pkg.version %>
 * @version: v<%= ME.VERSION %>
 * @build: [<%= ME.NODE_ENV %>] ${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')}
 * @license: <%= pkg.license %>
 * @link: <%= pkg.homepage %>
 * @repository: <%= pkg.github %>
 * Copyright (c): Since ${dateFormat(now, 'yyyy')} - <%= pkg.author.email %>
 */

`);

let footerTpl = _.template(`
/**
 * @version: v<%= ME.VERSION %>
 * @commit: <%= ME.COMMIT %>
 * @build: [<%= ME.NODE_ENV %>] ${dateFormat(now, 'yyyy-mm-dd')}T${dateFormat(now, 'HH:MM:ss')}
 * @package: <%= pkg.name %>@<%= pkg.version %> - <%= pkg.title %>
 * =========================================================================== *
 */
`);

const Banner = {
    header: headerTpl({pkg: ME.pkg, ME: ME})
  , footer: footerTpl({pkg: ME.pkg, ME: ME})
};

ME.Banner = Banner;

var envConfig = {
    string:  'env'
  , default: {env: (process.env.NODE_ENV || ME.NODE_ENV || global.NODE_ENV || 'test')}
};
envConfig = parseArgs(process.argv.slice(2), envConfig);


//-------//
// TASKS //
//-------//

gulpTasks({
    path:      process.cwd() + '/gulp-tasks'
  , separator: ':'
  , passGulp:  true
});


//  ENV ROUTER
gulp.task('default', function () {

  //  DEFAULT Scenario Route
  (function () {
    switch (ME.NODE_ENV) {
      case 'test': {
        return ['test'];
        break;
      }
      case ('dev' || 'development'): {
        return ['dev'];
        break;
      }
      case ('prod' || 'production'): {
        return ['build'];
        break;
      }
      default: {
        return ['greet'];
        break;
      }
    }
  })();

});

gulp.task('test',  ['greet']);
gulp.task('greet', ['show:config', 'usage']);
gulp.task('build', ['bower2src'], function () {
  gulp.start('sync:src2build');
});

// Log file paths in the stream
gulp.task('files:src', function () {
  return  gulp.src([
              path.join(ME.SRC, '**/*')
            , path.join(ME.SRC, '**/*.*')
            , path.join(ME.SRC, '**/.*')
          ])
          .pipe(changed(ME.BUILD))
          .pipe(vinylPaths(function (loPath) {
            console.log(`Changed: [${loPath}]`);
            return Promise.resolve();
          }));
});

gulp.task('show:config', function () {
  console.warn(`ENV Config: [${utin(envConfig)}]`);
  console.log(`APP-Config: [${utin(ME.Config)}]`);
});

gulp.task('usage', function () {
  console.log('\n' + (new Array(50).join('-')));
  console.info('\n' + 'Usage: gulp <task>\t-\tRun gulp task(s) specified');
  console.info('\n, where <task> is one of:\n');
  console.warn('\tusage' + '\t\t', 'Show this topic');
  console.warn('\tshow:config' + '\t', 'Show Configuration file');
  console.warn('\tfiles:src' + '\t', 'Log File Paths in the Stream');
  console.warn('\tsync:bower2src' + '\t', 'Collect main bower files into build/resources');
  console.warn('\tsync:src2build' + '\t', 'Copy source code into build/');
  console.log('\n' + (new Array(50).join('-')));
  console.warn('\n');
});
