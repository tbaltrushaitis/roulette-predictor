/*  JS/app-config-require.js  */

;(function (require) {

  require.config({
      baseUrl: 'assets/js'
    , waitSeconds: 6
  });

  (function () {
    var config = {
      map: {
        "*": {
          // common: 'app/common'
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
          jquery: 'lib/jquery'
        , underscore: 'lib/underscore'
        , bootstrap: 'lib/bootstrap'
        , tmpl: 'lib/jquery.tmpl'
        , noty: 'plugins/jquery.noty'
        , knob: 'plugins/jquery.knob'
     // , sparkline: 'plugins/jquery.sparkline'
        , Chart: 'plugins/Chart'
        , functions: 'app/functions'
        , appController: 'app/controllers/appController'
      }
    , shim: {
          jquery: {
            exports: 'jQuery'
          }
        , underscore: {
            exports: '_'
          , deps: ['jquery']
          }
        , bootstrap: {
            exports: 'bootstrap'
          , deps: ['jquery']
          }
        , noty: ['jquery']
        , functions: ['jquery', 'underscore', 'noty']
        // , appController: ['jquery', 'underscore', 'knob', 'sparkline', 'Chart']
        , appController: ['jquery', 'underscore', 'knob', 'Chart']
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
