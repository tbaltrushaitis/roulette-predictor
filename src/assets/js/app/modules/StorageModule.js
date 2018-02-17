/*  JS/APP/MODULES/StorageModule.js  */

// define(function () {

define([
        'jquery'
      , 'underscore'
      // , 'SampleData'
    ]
  , function (
        $
      , _
      // , SampleData
    ) {

        /*
        var Sample  =   new SampleData();
        */


    //  CONSTRUCTOR
    var Storage =   function (loParamData, loParamOpts, loCallback) {
        var self            =   this
          , dfdClass        =   $.Deferred()
          , dfdPrototype    =   $.Deferred()
        ;

        // \/\* INIT
        dfdPrototype =  self._init();
        $.when(dfdPrototype).then(function (oClass) {
            dfdClass.resolve(oClass);
        });

        return dfdClass.promise();
    };


    //  PROTOTYPE
    Storage.prototype   =   {

        'defaults': {

            'self_class': "Storage"
          , 'options':  {}
          , 'data':     {}
          , 'Modules':  {
                'Storage':  localStorage
            }
          , 'Helpers': {
                'Storage':  localStorage
            }

        }


        // Initialization
      , '_init':    function () {
            var self    =   this;
            return self.Init();
        }


        // Init
      , 'Init': function () {
            var self    =   this;
            var dfdInit =   $.Deferred();

            //  Apply DEFAULT class OPTIONS
            var loaded  =   $.when( _.extend(self, self.defaults) )
                             .then( function (objSelf) {
                                // return objSelf.Load();
                                return objSelf;
                            });

            $.when(loaded).then(function (objSelf) {
                dfdInit.resolve(objSelf);
            });

            return dfdInit.promise();
        }


        // Load Default Data and Modules
      , 'Load': function () {
            var self    =   this
              , dfdLoad =   $.Deferred()
              , dfdModules  =   $.Deferred()
            ;

            // $.when(dfdModules).then(function (loData) {
            $.when(dfdModules.resolve(self.Modules)).then(function (loData) {
                _.extend(self.Helpers, loData);
                dfdLoad.resolve(self);
            });
            return dfdLoad.promise();
        }

        //  Getter/Setter for Simple Data Format
      , 'getItem':  function (item) {
            var self    =   this;
            return self.Helpers.Storage.getItem(item);
        }


      , 'setItem':  function (item, data) {
            var self    =   this;
            return self.Helpers.Storage.setItem(item, data);
        }


        //  Getter/Setter for JSON Data Format
      , 'getJSON':  function (item) {
            var self    =   this;
            return JSON.parse( self.getItem(item) );
        }
      , 'setJSON':  function (item, data) {
            var self    =   this;
            return self.setItem(item, JSON.stringify(data));
        }


        //  DELETE Item
      , 'deleteItem':   function (item) {
            var self    =   this;
            self.Helpers.Storage.removeItem(item);
            return self;
        }


        //  CLEAR
      , 'clearItems':   function () {
            var self    =   this;
            self.Helpers.Storage.clear();
            return self;
        }

    };

    return Storage;

});

/*
    return {
        'Storage': Storage
    };
*/

