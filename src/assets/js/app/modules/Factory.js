/* ASSETS/JS/MODULES/Factory.js */
/** Usage:
    var Factory     =   new (require('Factory'))
      , Templater   =   Factory.createModule("Templater")
    ;
 **/

define([
    'require'
  , 'jquery'
  , 'underscore'
  , 'bb'
  , 'Abstract'
  , 'functions'
    ]
    // DOM ready
  , function (
        require
      , $
      , _
      , bb
    ) {

    "use strict";

    console.groupCollapsed("FACTORY");
    console.timeStamp("INIT::START");

    var Abstract    =   new require('Abstract');

    //  CONSTRUCTOR
    var Factory =   function () {
            var self        =   this;
            self._entity    =   'Factory';
            self._modules   =   {};
            Abstract.call(self);
        }
    ;

    //  PROTOTYPE
    Factory.prototype             =   Object.create(Abstract.prototype);
    Factory.prototype.constructor =   Factory;


    //  PRIVATE METHODS  //

    //  CREATE MODULE
    Factory.prototype.createModule  =   function (type) {
        console.groupCollapsed("FACTORY::createModule(" + type + ")");
        var self        =   this
          , dfdMethod   =   $.Deferred()
        ;
        //  CONSTRUCTOR
        var freshModule =   function () {
                var self        =   this;
                self._entity    =   type;
                self._modules   =   {};
                Abstract.call(self);
            }
        ;
        //  PROTOTYPE
        freshModule.prototype             =   Object.create(Abstract.prototype);
        freshModule.prototype.constructor =   freshModule;

        $.when( (new freshModule()) )
         .then( function (loModule) {
            // loModule._config =   new (bb.Model.extend({}));
            // loModule.View   =   new (bb.View.extend({}));

            // self.notify("New Instance of " + loModule._entity + " Created", "success");
            console.info("NEW " + loModule._entity + " (" + typeof(loModule) + "):", loModule);

            console.groupEnd("FACTORY::createModule(" + type + ")");
            dfdMethod.resolve(loModule);
        });

        return dfdMethod.promise();
    };


    //  CREATE VIEW
    Factory.prototype.createView    =   function (o) {
        var self        =   this
          , dfdMethod   =   $.Deferred()
        ;

        //  CONSTRUCTOR
//        console.log("Abstract_View:", Abstract_View );
        //console.log("Abstract_View.prototype:", Abstract_View.prototype );
        //console.log("Abstract_View.constructor:", Abstract_View.constructor );
//        var freshModule   =   new Abstract_View;
        //  CONSTRUCTOR
        /*var freshModule =   function () {
                var self    =   this;
                Abstract_View.call(self);
            }
        ;*/


        //  PROTOTYPE
        //freshModule.prototype             =   Object.create(Abstract_View.prototype);
        //freshModule.prototype.constructor =   freshModule;

/*
        $.when( (freshModule ) )
         .then( function (loModule) {
            loModule.Config =   new (bb.Model.extend());
            //loModule.Config.set(o);

            self.notify("New Instance of View " + loModule._entity + " Created.", "success");
            console.info("NEW VIEW:", typeof(loModule), loModule);
            dfdMethod.resolve(loModule);
        });
*/

        return dfdMethod.promise();
    };


    console.timeStamp("INIT::FINISHED");
    console.groupEnd("FACTORY");
    return Factory;

});

