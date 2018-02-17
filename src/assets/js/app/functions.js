/*  ASSETS/JS/APP/functions.js  */

function Notify (notyText, notyType, notyTimeout) {
  var lowType   = notyType.toLowerCase()
    , loTimeout = notyTimeout || 2500
  ;

  noty({
      layout:  'bottomRight'
    , text:    notyText + '<div class="small-1"><span class="label label-xs pull-right">' + (new Date()).toLocaleString() + '</span></div>'
    , type:    lowType
    , timeout: ('error' === lowType ? false : loTimeout)
    , modal:   ('error' === lowType)
    , maxVisible: 5
    , closeWith: ['click', 'button']
  });

  return false;
};
