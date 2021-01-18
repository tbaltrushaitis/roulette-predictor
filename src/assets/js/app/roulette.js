/*  ASSETS/JS/APP/roulette.js  */

;(function ($) {

  var init = function () {
    console.log('Roulette INIT');
  };

  //  Fetch Roulettes Config
  this.fetchRoulettesConfig = function () {
    var dataUrl  = 'data/roulettes.json';
    var response = $.ajax({
          async:   false
        , data:    {}
        , timeout: 5000
        , type:    'GET'
        , url:     dataUrl
      });

    try {
      var retResult = JSON.parse(response.responseText);
      return retResult;
    }catch (err) {
      console.error('ERROR = ', typeof(err), err);
    };

    return {
        error:    true
      , message:  'Cannot get Roulettes Config from JSON file.'
    };
  };

  console.log('Roulette READY!');

  return {
    fetchRoulettesConfig: fetchRoulettesConfig
  };

})(jQuery);
