/* ASSETS/JS/APP/Roulette.class.js */

define([
    'jquery'
  , 'underscore'
]
// Dependencies ready
, function ($, _) {

  'use strict';

  //  CONSTRUCTOR
  var Roulette = function () {
    var self = this
      , dfdClass     = $.Deferred()
      , dfdPrototype = $.Deferred()
      , i            = 0
    ;

    // INIT
    dfdPrototype = self._init();

    // Wait while instance initialized
    setTimeout(function working () {
      if ('pending' === dfdPrototype.state()) {
        console.log('\tLoading ' + self._entity + ' ... ', i++);
        if (i <= 5) {
          setTimeout(working, 100);
        }
      }
    }, 1);

    $.when(dfdPrototype)
     .then(function (oClass) {
      dfdClass.resolve(oClass);
    });

    return dfdClass.promise();
  };

  //  PROTOTYPE
  Roulette.prototype = {

      _entity:  'Roulette.class'
    , _config:  {}
    , _modules: {}
    , _options: {}
    , _data: {
        items: []
      }

      //  INIT
    , _init: function () {
        var self = this;
        return self.Init();
      }

      //  INITIALIZATION
    , Init: function () {
        var self    = this
          , dfdInit = $.Deferred()
          , i       = 0
        ;

        //  Apply DEFAULT class OPTIONS
        var loaded  = $.when(self.Load())
                       .then(function (objSelf) {
                        return objSelf;
                      });

        setTimeout(function workInit () {
          if ('pending' === loaded.state()) {
            console.log('\tInit ' + self._entity + ' ... ', i++);
            if (i <= 5) {
              setTimeout(workInit, 100);
            }
          }
        }, 1);

        $.when( loaded )
         .then( function (objSelf) {
            dfdInit.resolve(objSelf);
        });

        return dfdInit.promise();
      }


      // Load Default Data and Modules
    , Load: function () {
        var self       = this
          , dfdMethod  = $.Deferred()
          , dfdConfig  = $.Deferred()
          , dfdModules = $.Deferred()
        ;

        $.when( self.getConfig() )
         .then( function (loConfig) {
            self._config[self._entity] = {};
            _.extendOwn(self._config[self._entity], loConfig);
            dfdConfig.resolve(self);
        });

        dfdConfig
          .done( function (objSelf) {
            dfdModules.resolve(objSelf);
          });

        dfdModules
          .done(function (loSelf) {
            loSelf.Config.set({'timestamp': (new Date()).getTime()});
            dfdMethod.resolve(loSelf);
          });

        return dfdMethod.promise();
      }


      // NOOP routine
    , noop: function () {
        var self = this;
        self.notify('NOOP from Roulette.class Called', 'alert');
        return self;
      }

      //  Update Options
    , setOptions: function (o) {
        var self = this;
        self.notify('setOptions', 'alert');
        if ('object' === typeof(o)) {
          _.extendOwn(self._options, o);
        }
        return self;
      }

      // Notifier
    , notify: function (sText, sType) {
        var self    = this
          , lowType = (true === !!sType ? sType : 'information').toLowerCase()
        ;
        console.timeStamp(self._entity + '[' + sType + ']' + ':\t' + sText);
      }

      //  Send AJAX Request
    , sendRequest: function (requestData) {
        // console.log("sendRequest(requestData):", requestData);
        var self      = this
          , dfdMethod = $.Deferred()
          , defOpts   = {   headers: {
                              'X-Powered-By': 'tbaltrushaitis'
                            }
                          , point: '/'
                          , route:  'data'
                          , target: 'roulette.json'
                        }
          , o           = _.extendOwn(defOpts, ('object' === typeof(requestData) ? requestData : {}))
          , requestURL  = ((o.url || o.point)
                          + '/'
                          + o.route
                          + '/'
                          + o.target
                          )
          , dataResponse =  $.ajax({
                                url:  requestURL
                              , data: o.data
                              , type: o.method || 'GET'
                              , datatype: (o.datatype || 'json')
                              , async: false
                              , beforeSend: function (req) {
                                  if (o.headers) {
                                    for (name in o.headers) {
                                      if (o.headers[name]) {
                                        req.setRequestHeader(name, o.headers[name]);
                                      }
                                    }
                                  }
                                }
                            }).responseText;
        console.groupCollapsed(self._entity + '.sendRequest');
        var dataJSON = (true === !!dataResponse)
                        ? JSON.parse(dataResponse)
                        : {message: 'Request FAILED'};

        $.when(dataResponse, dataJSON)
         .then(function (lcData, loData) {
            console.groupEnd(self._entity + '.sendRequest');
            dfdMethod.resolve(loData);
        });

        return dfdMethod.promise();
      }

      //  CONFIG LOAD
    , getConfig: function (oRequest) {
        var self = this
          , dfdMethod  = $.Deferred()
          , dfdRequest = $.Deferred()
          , reqData = {
                method: 'GET'
              , point:  '/'
              , route:  'data/modules'
              , target: 'roulette.json'
            };
        dfdRequest = self.sendRequest(reqData);
        dfdRequest
          .done(function (oConfig) {
            dfdMethod.resolve(oConfig);
          })
          .fail(function (loError) {
            self.notify('Config Load Failed', 'error');
            dfdMethod.reject(loError);
          });

        return dfdMethod.promise();
      }

  };

  return Roulette;

});
