/*  ASSETS/JS/app-config-require.js  */

//  IIFE
;(function (require) {

  require.config({
      baseUrl:      'assets/js'
    , waitSeconds:  6
  });

  (function () {
    var config = {
      map: {
        "*": {
          // common:    'app/common'
          // functions: 'app/functions'
        }
      }
    };
    require.config(config);
  })();

  (function () {
    var config = {
      map: {
        "*": {
          // index: 'app/index'
        }
      }
    , paths: {
          jquery:         'lib/jquery.min'
        , underscore:     'lib/underscore.min'
        , bootstrap:      'lib/bootstrap.min'
        , tmpl:           'lib/jquery.tmpl.min'
        , noty:           'lib/jquery.noty.packaged.min'
        , knob:           'lib/jquery.knob.min'
        , Chart:          'lib/Chart.min'
        , functions:      'app/functions'
        , appController:  'app/controllers/appController'
        // , sparkline:   'plugins/jquery.sparkline'
      }
    , shim: {
          jquery: {
            exports: 'jQuery'
          }
        , underscore: {
              exports:  '_'
            , deps:     ['jquery']
          }
        , bootstrap: {
              exports:  'bootstrap'
            , deps:     ['jquery']
          }
        , noty:           ['jquery']
        , functions:      ['jquery', 'underscore', 'noty']
        , appController:  ['jquery', 'underscore', 'knob', 'Chart']
        // , appController: ['jquery', 'underscore', 'knob', 'sparkline', 'Chart']
      }
    , deps: [
          'jquery'
        , 'underscore'
      ]
    };

    require(['jquery'], function ($) {
      $.noConflict();
    });

    require.config(config);
  })();

  // Load the main app module to START the app
  (function () {
    require(['app-starter']);
  })();

})(require);
