/*  ASSETS/JS/app-starter.js  */

require(['jquery', 'appController'], function ($) {
  console.timeStamp('MODULES LOADED)';
});

define([
    'jquery'
  , 'appController'
]
// DOM ready
, function ($, appController) {
  'use strict';

  var Controller = appController;

  $.when(Controller)
   .then(function (loController) {
      console.timeStamp('START CONTROLLER');
      loController.start();
  });
});
