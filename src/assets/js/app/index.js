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

  console.log(`START INDEX`);

  // Create instance of Dispatcher
  let Factory    = new (require('Factory'))
    , Dispatcher = Factory.createModule('Dispatcher')
  ;

  // Init Dispatcher
  // var Dispatcher = new (require('Dispatcher'));

  //  Create Dispatcher baswed on BackBone.Model
  Dispatcher.Model = new (bb.Model.extend({
    initialize: function () {
      this.items = new (bb.Collection.extend({}));
    }
  }));
  Dispatcher.Config = new (bb.Model.extend({}));
  console.log('[app/index] START DISPATCHER');

  console.info('[app/index] Lets load a piece of data ..');
  Dispatcher.Config = Dispatcher.getConfig({route: 'data', target: 'roulettes.json'});

  console.log(Dispatcher.Config.get());
});
