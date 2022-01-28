/*  JS/APP/CONTROLLERS/appController.js  */

define([
    'jquery'
  , 'underscore'
  , 'tmpl'
  , 'Chart'
  , 'bootstrap'
  , 'functions'
]
, function ($, _, tmpl, Chart) {

  'use strict';

  var dataUrl             = 'data/roulettes.json'
    , ChartDefOptionsUrl  = 'data/Chart-defaults-global.json'
    , ChartBarOptionsUrl  = 'data/Chart-bar-options.json'
    , selectorPredictors  = '.box-stats-predictor'
    , winContainer   = $('#win-container')
    , freqsContainer = $('#freqs-rows-container')
    , boardContainer = $('#roulette-board')
    , goWinDefault   = {id: null}
    , goWinLast      = {id: null}
    , gaRoulEuro     = []
    , gaRoulAmer     = []
    , gaPredictors   = []
    , gameMemo       = []
    , gamePlay       = []
    , goGameStats    = {}
    , Posnum         = 0
    , defaultOffset  = 0
    , stepsLimit     = 16
    , gnTakeInto     = 18
    , defStats = {
          rounds: {
              count: 0
            , perc:  0
            , total: 0
          }
        , red: {
              count: 0
            , perc:  0
          }
        , black: {
              count: 0
            , perc:  0
          }
        , zero: {
              count: 0
            , perc:  0
          }
        , odd: {
              count: 0
            , perc:  0
          }
        , even: {
              count: 0
            , perc:  0
          }
        , low: {
              count: 0
            , perc:  0
          }
        , high: {
              count: 0
            , perc:  0
          }
      }
    , defOpts = {
          steps:  0
        , prev:   0
        , curr:   0
        , offset: 0
        , rotate: 'clockwise'
        , spin:   'right'
        , note:   ''
      }
    , winOpts = {
          min: 0
        , max: stepsLimit * 2 - 1
      }
    , rangesChart     = undefined
    , rangesChartData = undefined
  ;

  var ChartDefOptions = fetchFile(ChartDefOptionsUrl);
  var ChartBarOptions = fetchFile(ChartBarOptionsUrl);
  _.extend(Chart.defaults.global, ChartDefOptions);

  const gaGridColors = [
      'fff'
    , 'a0e6ff'
    , '4bc7cf'
    , 'dde26a'
    , 'ffdf46'
    , 'e88e5a'
    , '828e84'
    , 'fd5240'
    , 'ff85cf'
    , 'fd0e35'
    , '299617'
  ];


  //--------------------
  //- START CONTROLLER -
  //--------------------
  function start () {

    fetchRoulettesConfig();
    initPlugins();
    resetGame();

    renderView();

    addPredictor({stage: 0, steps: 10});
    addPredictor({stage: 3, steps: 10});
    addPredictor({stage: 0, steps: 5});
    addPredictor({stage: 3, steps: 5});

    bindEvents();
  };


  //---------------------
  //- Fetch JSON Config -
  //---------------------
  function fetchFile (url) {
    var response = $.ajax({
        async:   false
      , data:    {}
      , timeout: 5000
      , type:    'GET'
      , url:     url
    });

    try {
      var retResult = JSON.parse(response.responseText);
      return retResult;
    } catch (err) {
      console.error('Cannot parse "responseText"! ERROR_MESSAGE = ', typeof(err), err);
    };

    return {
        error:    true
      , message:  `Cannot get Content from URL: [${url}]`
    };
  };


  //--------------------------
  //- Fetch Roulettes Config -
  //--------------------------
  function fetchRoulettesConfig () {
    var response = $.ajax({
        async:   false
      , data:    {}
      , timeout: 5000
      , type:    'GET'
      , url:     dataUrl
    });

    try {
      var retResult = JSON.parse(response.responseText);
      localStorage.setItem('euroRoulette', JSON.stringify(retResult.roulettes.european));
      //localStorage.setItem('amerRoulette', JSON.stringify(retResult.roulettes.american));
      gaRoulEuro = retResult.roulettes.european;
      gaRoulAmer = retResult.roulettes.american;
      return retResult;
    } catch (err) {
      console.error('Cannot parse responseText! ERROR = ', typeof(err), err);
    };

    return {
        error:    true
      , message:  'Cannot get Roulettes Config from ' + dataUrl + ' file.'
    };
  };


  //--------------------------
  //- PLUGINS INITIALIZATION -
  //--------------------------
  function initPlugins () {
    var rangesCanvas = document.getElementById('chart-steps-freqs').getContext('2d');

    $('.knob').knob();


    //----------------------------
    //- RANGES FREQUENCIES CHART -
    //----------------------------
    var aLabels = _.range(stepsLimit + 3)
      , aData   = _.times(stepsLimit + 3, function (n) {return 0;});

    rangesChartData = {
        labels: aLabels
      , datasets: [
          {   label:       'Step Frequency'
            , fillColor:   'rgba(00, 166, 90, 0.5)'
            , strokeColor: 'rgba(00, 166, 90, 0.9)'
            , data:        aData
          }
        ]
    };
    // rangesChart = new Chart(rangesCanvas).Bar(rangesChartData, ChartBarOptions);
    rangesChart = new Chart(rangesCanvas, {
        type:    'bar'
      , data:    rangesChartData
      , options: ChartBarOptions
    });
  };


  //-------------------
  //- RESET GAME DATA -
  //-------------------
  function resetGame () {
    Posnum      = 0;
    gameMemo    = [];
    gamePlay    = [];
    goWinLast   = goWinDefault;
    goGameStats = defStats;
    localStorage.setItem('lastWin', JSON.stringify(goWinDefault));
    winContainer.empty();

/*
  var aData = _.times(stepsLimit + 3, function (n) {return 0;});
  _.each(aData, function (v, i) {
      rangesChart.datasets[0].bars[i].value = v;
  });
  rangesChart.update();
*/

/*
  $('.knob')
    .trigger('configure', {'angleOffset': 0})
    .val( null )
    .trigger('change');
*/

  };


  //-------------
  //- RENDERING -
  //-------------
  function renderView () {
    var euroSorted = _.sortBy(gaRoulEuro, function (oWin) { return Number(oWin.win); } );
    _.extend(winOpts, {max: gaRoulEuro.length});
    _.each(euroSorted, function (rObj, rKey) {
      if (rKey > 0) {
        $('#tpl-board-item')
          .tmpl(rObj)
          .prependTo(boardContainer);
      }
    });

    $('#tpl-board-item')
      .tmpl(euroSorted[0])
      .removeClass('col-xs-2')
      .addClass('col-xs-12')
      .find('a')
      .addClass('btn-zero')
      .addClass('btn-block')
      .end()
      .appendTo(boardContainer);

    var lstWinsEuro = _.pluck(gaRoulEuro, 'win')
      , strWinsEuro = lstWinsEuro.join(', ')
      , lstWinsAmer = _.pluck(gaRoulAmer, 'win')
      , strWinsAmer = lstWinsAmer.join(', ')
    ;

    $('#roulette-european-list').text('[' + strWinsEuro + ']');
    $('#roulette-american-list').text('[' + strWinsAmer + ']');
  };


  //------------------
  //- EVENTS BINDING -
  //------------------
  function bindEvents () {

    //  TEST FUNC BUTTON
    $('body').delegate('#btn-testPlay', 'click', function (e) {

    });


    // ADD PREDICTOR
    $('body').delegate('#btn-add-predictor', 'click', function (e) {
      var widgetId = addPredictor();
      updatePredictor(widgetId);
    });


    // SAVE PREDICTORS
    $('body').delegate('#btn-save-predictors', 'click', function (e) {
      savePredictors();
    });


    // LOAD PREDICTORS
    $('body').delegate('#btn-load-predictors', 'click', function (e) {
      loadPredictors();
      updatePredictors();
    });


    //  RESET GAME DATA
    $('body').delegate('#btn-grid-clear', 'click', function (e) {
      resetPredictors();
      resetGame();
    });


    //  LOG GAME STATS INTO CONSOLE
    $('body').delegate('#btn-log-stats', 'click', function (e) {
      console.group('GAME-STATS');
      console.log('gameMemo = ', typeof(gameMemo), _.size(gameMemo), gameMemo);
      console.log('gamePlay = ', typeof(gamePlay), _.size(gamePlay), _.pluck(gamePlay, ['win']));
      console.log('goGameStats = ', typeof(goGameStats), _.size(goGameStats), goGameStats);
      console.groupEnd('GAME-STATS');
    });


    //  ONBLUR
    $('body').delegate('input.w-value', 'blur', function (e) {
      var wId = $(e.currentTarget).parent().parent().attr('id');
      resetPredictor(wId);
      updatePredictor(wId);
    });


    //  PLAY ONE ROUND
    $('body').delegate('.btn-brd', 'click', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var that   = $(e.currentTarget)
        , thatId = Number(that.attr('data-id'));

      resetPredictors();
      playRound(thatId);
    });

  };


  //------------
  //- GAMEPLAY -
  //------------
  function playRound (pnId) {
    var dfdResult     = $.Deferred()
      , dfdPredictors = $.Deferred();

    var winObj = _.findWhere(gaRoulEuro, {id: pnId})
      , oRange = getLastRange( pnId );
    _.extend(winObj, {posnum: ++Posnum}, oRange);

    goWinLast = winObj;
    localStorage.setItem('lastWin', JSON.stringify(winObj));

    // RENDER GRID ROW
    $('#tpl-win-sample')
      .tmpl(winObj)
      .prependTo(winContainer);


    // STEP GAUGE
    $('#win_gauge')
      .trigger('configure', {
        angleOffset: oRange.angleOffset
      })
      .val( oRange.steps )
      .trigger('change');
    $('#step-num').text(winObj.posnum);


    gamePlay.push(winObj);
    $('#records-num-holder').text(goWinLast.posnum);

    updateGameStatsData();
    updateGameStatsTable();

    updateFreqsData();
    updateFreqsGrid();

    // updateFreqsChart();

    dfdPredictors = updatePredictors();
    dfdPredictors
      .done( function (loStatus) {
        //console.timeStamp('WIN: ' + winObj.win + '; PREDICTORS UPDATE: ' + ' ' + (!!loStatus ? 'OK' : 'FAILED') );
      });

  };


  //---------------------------
  //- STEPS FREQUENCIES DATA -
  //---------------------------
  function updateFreqsData () {
    var gameRange   = _.last(gamePlay, gnTakeInto);
    var newArrSteps = _.times(stepsLimit + 3, function (n) {return 0;});
    var newArrPerc  = _.times(stepsLimit + 3, function (n) {return 0;});
    var newData = {
        steps: newArrSteps
      , perc:  newArrPerc
    };
    var sumRounds = gameRange.length;

    if (sumRounds > 0) {
      _.each(gameRange, function (roundData, idx) {
        var cntSteps    = newData.steps[roundData.steps] || 0
          , cntStepsNew = ++cntSteps
          , cntPerc     = (cntStepsNew * 100 ) / sumRounds
        ;
        newData.steps[roundData.steps] = cntStepsNew;
        newData.perc[roundData.steps]  = cntPerc;
      });
    }

    gameMemo = newData;
  };


  //---------------------------
  //- STEPS FREQUENCIES GRID -
  //---------------------------
  function updateFreqsGrid () {
    freqsContainer.empty();

    var totalSteps = 0
      , totalPerc  = 0;

    for (var i = 0; i <= (gameMemo.steps.length - 1); i++) {
      var o = {
          step:  i
        , steps: gameMemo.steps[i]
        , perc:  gameMemo.perc[i].toFixed(2)
      };
      totalSteps += gameMemo.steps[i];
      totalPerc  += gameMemo.perc[i];
      var colorIndex = parseInt(Math.floor(o.perc / 10));

      $('#tpl-freqs-grid-row')
        .tmpl(o)
        .css({
            'background-color': '#' + gaGridColors[colorIndex]
          , 'color': '#' + (colorIndex > 0 ? 'fff' : '000')
        })
        .appendTo(freqsContainer);

    };

    var o = {
        step:  'Total'
      , steps: totalSteps
      , perc:  totalPerc.toFixed(2)
    };

    $('#tpl-freqs-grid-row')
      .tmpl(o)
      .toggleClass('disabled', true)
      .toggleClass('bg-navy', true)
      .appendTo( $('#freqs-rows-total').empty() );

    $('#step-freqs-stats').text(goWinLast.posnum);
  };


  //----------------------------
  //- RANGES FREQUENCIES CHART -
  //----------------------------
  function updateFreqsChart () {
    _.each(gameMemo.perc, function (v, i) {
      if (_.isNumber(v)) {
        // rangesChartData.datasets = rangesChartData.datasets || [];
        // rangesChartData.datasets[0].bars = rangesChartData.datasets[0].bars || [];
        rangesChartData.datasets[0].bars[i].value = v;
      }
    });
    rangesChart.update();
    $('#step-num-freq').text(goWinLast.posnum);
  };


  //-------------------
  //- GAME STATS DATA -
  //-------------------
  function updateGameStatsData () {
    var gameRange   = _.last(gamePlay, gnTakeInto)
      , roundsTotal = ++goGameStats.rounds.total
      , roundsCount = _.size(gameRange);

    goGameStats.rounds.total = roundsTotal;
    goGameStats.rounds.count = roundsCount;
    goGameStats.rounds.perc  = Number((goGameStats.rounds.count * 100 / goGameStats.rounds.total).toFixed(2));

    var reds   = 0
      , blacks = 0
      , zeros  = 0
      , odds   = 0
      , evens  = 0
      , lows   = 0
      , highs  = 0
    ;

    _.each(gameRange, function (loWin) {
      var lnWin = Number(loWin.win);

      ('red' === loWin.color)   ? reds++   : false;
      ('black' === loWin.color) ? blacks++ : false;
      ('green' === loWin.color) ? zeros++  : false;

      (true === loWin.odd)  ? odds++  : false;
      (false === loWin.odd) ? evens++ : false;

      ((1 <= lnWin) && (18 >= lnWin))  ? lows++  : false;
      ((19 <= lnWin) && (36 >= lnWin)) ? highs++ : false;
    });

    goGameStats.red.count   = reds;
    goGameStats.black.count = blacks;
    goGameStats.zero.count  = zeros;
    goGameStats.odd.count   = odds;
    goGameStats.even.count  = evens;
    goGameStats.low.count   = lows;
    goGameStats.high.count  = highs;

    goGameStats.red.perc   = Number((reds   * 100 / roundsCount).toFixed(2));
    goGameStats.black.perc = Number((blacks * 100 / roundsCount).toFixed(2));
    goGameStats.zero.perc  = Number((zeros  * 100 / roundsCount).toFixed(2));
    goGameStats.odd.perc   = Number((odds   * 100 / roundsCount).toFixed(2));
    goGameStats.even.perc  = Number((evens  * 100 / roundsCount).toFixed(2));
    goGameStats.low.perc   = Number((lows   * 100 / roundsCount).toFixed(2));
    goGameStats.high.perc  = Number((highs  * 100 / roundsCount).toFixed(2));

  };


  //--------------------
  //- GAME STATS TABLE -
  //--------------------
  function updateGameStatsTable () {
    $('#stat-row-rounds').find('.t-value').text(goGameStats.rounds.count);
    $('#stat-row-rounds').find('.t-perc').text( goGameStats.rounds.perc + ' %');

    $('#stat-row-reds').find('.t-value').text(goGameStats.red.count);
    $('#stat-row-reds').find('.t-perc').text(goGameStats.red.perc + ' %');

    $('#stat-row-blacks').find('.t-value').text(goGameStats.black.count);
    $('#stat-row-blacks').find('.t-perc').text(goGameStats.black.perc + ' %');

    $('#stat-row-zeros').find('.t-value').text(goGameStats.zero.count);
    $('#stat-row-zeros').find('.t-perc').text(goGameStats.zero.perc + ' %');

    $('#stat-row-evens').find('.t-value').text(goGameStats.even.count);
    $('#stat-row-evens').find('.t-perc').text(goGameStats.even.perc + ' %');

    $('#stat-row-odds').find('.t-value').text(goGameStats.odd.count);
    $('#stat-row-odds').find('.t-perc').text(goGameStats.odd.perc + ' %');

    $('#stat-row-lows').find('.t-value').text(goGameStats.low.count);
    $('#stat-row-lows').find('.t-perc').text(goGameStats.low.perc + ' %');

    $('#stat-row-highs').find('.t-value').text(goGameStats.high.count);
    $('#stat-row-highs').find('.t-perc').text(goGameStats.high.perc + ' %');

    $('#table-game-records > tbody > tr > td').toggleClass('taked-into', false);
    $('#table-game-records > tbody > tr:lt(' + gnTakeInto + ') > td').toggleClass('taked-into', true);

    $('#step-num-stats').text(goWinLast.posnum);
  };


  //------------------------------
  //- Angle Offset for GAUGE graph
  //------------------------------
  function getAngle (offset) {
    return defaultOffset + Math.round( ((offset || 0) * 360) / gaRoulEuro.length, 0);
  }


  //------------------------------------------
  //- GET OBJECT With OFFSET and ROTATE Values
  //------------------------------------------
  function getLastRange (pWinId) {
    var oRet    = {}
      , Opts    = {}
      , lRoul   = gaRoulEuro.length
      , idCurr  = Number(pWinId)
      , winPrev = goWinLast.win
      , oCurr   = _.findWhere(gaRoulEuro, {id: idCurr})
      , oPrev   = _.findWhere(gaRoulEuro, {win: winPrev})
      , iCurr   = _.indexOf(gaRoulEuro, oCurr)
      , iPrev   = ((!!oPrev && 'object' === typeof(oPrev)) ? _.indexOf(gaRoulEuro, oPrev) : 0)
    ;

    var Diff      = iCurr - iPrev
      , DiffAbs   = Math.abs(Diff)
      , DiffRight = 0
      , DiffLeft  = 0
    ;

    if (Diff > 0) {
      DiffRight = DiffAbs;
      DiffLeft  = lRoul - DiffAbs;
    } else {
      DiffLeft  = DiffAbs;
      DiffRight = lRoul - DiffAbs;
    };

    if (0 == DiffRight || 0 == DiffLeft) {
      _.extend(Opts, {note: 'Repeat'});
    };
    if (DiffRight < DiffLeft) {
      //  CLOCKWISE
      _.extend(Opts, {
          steps:  DiffRight
        , offset: iPrev
        , rotate: 'clockwise'
        , spin:   'right'
      });
    };
    if (DiffRight > DiffLeft) {
      //  ANTICLOCKWISE
      _.extend(Opts, {
          steps:  DiffLeft
        , offset: iCurr
        , rotate: 'anticlockwise'
        , spin:   'left'
      });
    };

    var angleOffset = getAngle( Opts.offset );
    _.extend(Opts, {
        prev: iPrev
      , curr: iCurr
      , angleOffset: angleOffset
    });

    if (Opts.steps > stepsLimit) {
      //  LIMIT EXCEEDED
      _.extend(Opts, {
          ignore: true
        , note:   'Replay'
      });
    };

    _.extend(oRet, {}, defOpts, Opts);

    return oRet;
  };


  //--------------------------------------------
  //- GET OBJECT OF WIN With PREDICTORS INCLUDED
  //--------------------------------------------
  function getWinObj (opts) {
    var Result    = {}
      , itemLeft  = {}
      , itemRight = {}
      , Opts = _.extend({}, {
            stage: 0
          , steps: 0
        }, (opts || {}) )
      , predictPosRight = null
      , predictPosLeft  = null
    ;
    var rangeLen   = 1 + Number(Opts.stage)
      , stageRange = _.last(gamePlay, rangeLen)
      , stageLen   = stageRange.length
      , stageData  = ( stageLen > 0 ? _.first(stageRange) : {pos: 0} )
      , stagePos   = Number(stageData.pos)
    ;

    predictPosRight = stagePos + Opts.steps;
    predictPosLeft  = stagePos - Opts.steps;

    if (predictPosRight < 0) {
      predictPosRight = gaRoulEuro.length + predictPosRight;
    };
    if (predictPosLeft < 0) {
      predictPosLeft = gaRoulEuro.length + predictPosLeft;
    };
    if (predictPosRight >= gaRoulEuro.length) {
      predictPosRight = predictPosRight - gaRoulEuro.length;
    };
    if (predictPosLeft >= gaRoulEuro.length) {
      predictPosLeft = predictPosLeft - gaRoulEuro.length;
    };

    itemLeft  = _.findWhere(gaRoulEuro, {pos: Number(predictPosLeft)});
    itemRight = _.findWhere(gaRoulEuro, {pos: Number(predictPosRight)});

    Result =  _.extend({}, stageData, {
                predicts: {
                    left:  itemLeft
                  , right: itemRight
                }
              });

    return Result;
  };


  //-----------------------
  //- NEW WIDGET: PREDICTOR
  //-----------------------
  function addPredictor (o) {
    var Container = '#container-predictors'
      , Wrapper = $('#tpl-predictor-wrapper')
                    .tmpl()
                    .appendTo( Container )
      , uniqId  = _.uniqueId()
      , opts    = _.extend({
                      stage: 0
                    , steps: 5
                    , uuid: uniqId
                  }, (o || {}));
    //  BOX RENDER
    var widget = $('#tpl-predictor-box')
                  .tmpl( opts )
                  .appendTo( Wrapper );
    var widgetId = widget.attr('id');

    gaPredictors = $(selectorPredictors);
    return widgetId;
  };


  //------------------------
  //- RESET SINGLE PREDICTOR
  //------------------------
  function resetPredictor (wId) {
    $('#' + wId)
      .toggleClass('grow-50', false)
      .find('.w-value')
      .text('n/a')
      .toggleClass('bg-red',    false)
      .toggleClass('bg-black',  false)
      .toggleClass('bg-green',  false)
      .toggleClass('matched',   false);
  };


  //--------------------------------
  //- SINGLE PREDICTOR VALUES UPDATE
  //--------------------------------
  function updatePredictor (wId) {
    var dfdResult  = $.Deferred();
    var $el        = $('#' + wId);
    var dfdPredict = $.Deferred()
      , oParams = {
            stage: Number( $el.find('input.w-stage').val() )
          , steps: Number( $el.find('input.w-steps').val() )
        };
    var predictResult = getWinObj(oParams);

    $.when( (predictResult) )
     .done( function (loData) {
        dfdPredict.resolve(loData);
     })
     .fail( function (loErr) {
        console.warn('ERROR!');
        console.dir(loErr);
        dfdPredict.reject(loErr);
     });

    dfdPredict
      .done(function (loPredict) {
        //- RIGHT or CLOCKWISE
        $el.find('.w-value-right')
          .first()
          .text( Number(loPredict.predicts.right.win) )
          .addClass('bg-' + loPredict.predicts.right.color)
          .toggleClass('matched', goWinLast.win == loPredict.predicts.right.win)
        ;
        //- CURRENT WIN-Value
        $el.find('.w-value-win')
          .first()
          .text( Number(loPredict.win) )
          .addClass('bg-' + loPredict.color)
        ;
        //- LEFT or ANTICLOCKWISE
        $el.find('.w-value-left')
          .first()
          .text( loPredict.predicts.left.win )
          .addClass('bg-' + loPredict.predicts.left.color)
          .toggleClass('matched', goWinLast.win == loPredict.predicts.left.win)
        ;
        // HIGHLIGHT PREDICTOR WIDGET THAT HAVE MATCHES WITH Current WIN
        if (goWinLast.win == loPredict.predicts.left.win || goWinLast.win == loPredict.predicts.right.win) {
          $el.toggleClass('grow-50', true);
        };
      });

    return dfdResult.promise();
  };


  //-------------------------------------------
  //- RESET ALL PREDICTORS VALUES TO DEFAULTS -
  //-------------------------------------------
  function resetPredictors () {
    $('.box-stats-predictor')
      .toggleClass('grow-50',   false)
      .find('.w-value')
      .text('n/a')
      .toggleClass('bg-red',    false)
      .toggleClass('bg-black',  false)
      .toggleClass('bg-green',  false)
      .toggleClass('matched',   false)
    ;
  };


  //------------------------------------------------
  //- ALL PREDICTORS VALUES CALCULATION AND UPDATE -
  //------------------------------------------------
  function updatePredictors () {
    // console.group('updatePredictors');
    var dfdResult = $.Deferred();
    gaPredictors  = $(selectorPredictors);
    var curStep   = Number(goWinLast.steps || 0);
    var curWin    = Number(goWinLast.win   || 0);

    _.each(gaPredictors, function (el, idx) {
      var dfdPredict = $.Deferred()
        , $el        = $(el)
        , oParams = {
              stage: Number( $el.find('input.w-stage').val() )
            , steps: Number( $el.find('input.w-steps').val() )
          }
      ;
      var predictResult = getWinObj(oParams);

      $.when( (predictResult) )
       .done( function (loData) {
          dfdPredict.resolve(loData);
       })
       .fail( function (loErr) {
          console.warn('ERROR!');
          console.dir(loErr);
          dfdPredict.reject(loErr);
       });


      dfdPredict
        .done( function (loPredict) {

          var widgetOffset =  Number(oParams.stage)
            , widgetSteps =   Number(oParams.steps)
            , widgetWin   =   Number(loPredict.win)
            , winLeft     =   Number(loPredict.predicts.left.win)
            , winRight    =   Number(loPredict.predicts.right.win)
            , okMatchL    =   (curWin == winLeft)  || false
            , okMatchR    =   (curWin == winRight) || false
            , okMatch     =   (   0 == widgetOffset
                ? curStep === widgetSteps
                : ( okMatchL || okMatchR )
              )
          ;

          //- LEFT or ANTICLOCKWISE
          $el.find('.w-value-left')
            .first()
            .text( winLeft )
            .toggleClass('bg-' + loPredict.predicts.left.color, true)
            .toggleClass('matched', okMatchL);

          //- CURRENT WIN-Value
          $el.find('.w-value-win')
            .first()
            .text( widgetWin )
            .toggleClass('bg-' + loPredict.color, true)
            .toggleClass('matched', okMatch);

          //- RIGHT or CLOCKWISE
          $el.find('.w-value-right')
            .first()
            .text( winRight )
            .toggleClass('bg-' + loPredict.predicts.right.color, true)
            .toggleClass('matched', okMatchR);

          // HIGHLIGHT PREDICTOR WIDGET THAT HAVE MATCHES WITH Current WIN
          $el.toggleClass('grow-50', okMatch)
            .toggleClass('matched', okMatch);

          // console.groupEnd( $el.attr('id') );

          if (idx === (gaPredictors.length - 1)) {
            // console.groupEnd('updatePredictors');
            dfdResult.resolve(loPredict);
          };

        });

    });

    return dfdResult.promise();
  };


  //----------------------------------------
  //- SAVE PREDICTORS LIST to localStorage -
  //----------------------------------------
  function savePredictors () {
    var saveData = [];
    gaPredictors = $(selectorPredictors);

    _.each(gaPredictors, function (el, idx) {
      var $el     = $(el)
        , elId    = Number( $el.attr('id') )
        , oParams = {
              stage:  Number( $el.find('input.w-stage').val() )
            , steps:  Number( $el.find('input.w-steps').val() )
            , 'id-w': elId
          };
      saveData.push(oParams);
      return saveData;
    });

    localStorage.setItem('widgets', JSON.stringify({'predictors': saveData}));
    return Notify('Набор виджетов сохранён! [' + saveData.length + ']', 'success');
  };


  //------------------------------------------
  //- LOAD PREDICTORS LIST from localStorage -
  //------------------------------------------
  function loadPredictors () {
    $('#container-predictors').empty();
    var strListWidgets = localStorage.getItem('widgets');
    var lstWidgets     = JSON.parse(strListWidgets);
    var arrPredictors  = lstWidgets.predictors;

    _.each(arrPredictors, function (lo, idx) {
      addPredictor(lo);
    });
  };


  return {
    start: start
  };

});
