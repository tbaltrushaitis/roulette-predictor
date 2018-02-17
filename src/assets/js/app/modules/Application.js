/* ASSETS/JS/MODULES/Application.js */

'use strict';

define([
    'jquery'
  , 'underscore'
  , 'Abstract'
  , 'functions'
]
// DOM ready
, function ($, _, Abstract, modSession) {

  //  CONSTRUCTOR
  var Application = function () {
    var self      = this;
    self._entity  = 'Application';
    self._modules = {};
    Abstract.call(self);
  };

  //  PROTOTYPE
  Application.prototype             = Object.create(Abstract.prototype);
  Application.prototype.constructor = Application;

  //  METHODS

  return Application;

});
