/*  ASSETS/JS/APP/index.js  */

define([
    'require'
  , 'jquery'
  , 'underscore'
  , 'bb'
  , 'Tmpl'
  , 'Factory'
  , 'NetworkController'
  , 'bootstrap'
  , 'functions'
]
// DOM ready
, function (require, $, _, bb, tmpl) {

  'use strict';

  var dfdConfig     = $.Deferred()
    , dfdFactory    = $.Deferred()
    , dfdDispatcher = $.Deferred()
    , dfdPageData   = $.Deferred()
    , dfdPageRender = $.Deferred()
  ;

  console.timeStamp('START INDEX');

  var Factory    = new (require('Factory'))
    , Dispatcher = Factory.createModule('Dispatcher')
  ;

  // Init Dispatcher
  // var Dispatcher = new (require('Dispatcher'));

  Dispatcher.Model = new (bb.Model.extend({
    initialize: function () {
      this.items = new (bb.Collection.extend({}));
    }
  }));
  Dispatcher.Config = new (bb.Model.extend({}));
  console.timeStamp('START DISPATCHER');

  console.info('Lets load a piece of data ..');
  Dispatcher.Config = Dispatcher.getConfig({route: 'data', target: 'user-001.json'});

  console.log(Dispatcher.Config.get());
});
