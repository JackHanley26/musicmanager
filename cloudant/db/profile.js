
var _ = require('lodash');
var logger ;

var metrics = {
  _id: 100000,
  _dirty: false
};
var SEC = 1000, MIN = 60 * SEC,
  SLOW_DB_REQ  = 5 * SEC,
  STOP_DB_REQ_WARNINGS = 3 * MIN;


function humanReadableDiffs(start){
  var diff = process.hrtime(start);
  var diffNs = diff[0] * 1e9 + diff[1];
  var diffMs = Math.round(diffNs / 1e6 );
  var diffS = diffMs / 1e3;
  return {
    ms: diffMs,
    seconds: diffS
  };
}
function profile(db, fnName, dbName){

  var orginalFn = db[fnName];

  function profiled(){

    var id = metrics._id++, loggable = fnName, logParams, slowDbOp, stopWarning,
      originalArgs = [].slice.call(arguments),
      originalCallback = originalArgs.pop(),
      start = process.hrtime();

    function profiledCallback( /*err*/ ) {
      clearInterval(slowDbOp);
      clearTimeout(stopWarning);
      var diff = humanReadableDiffs( start );

      metrics._dirty = true;
      var metric = metrics[loggable];
      metric.totalTimeMs += diff.ms;
      metric.callCount++;
      metric.avgTimeMs = metric.totalTimeMs / metric.callCount;

      _.extend( logParams, diff );
      logger.info(logParams, 'Database operation complete');
      originalCallback.apply(this, arguments);
    }

    switch (fnName){
      case 'view':
      case 'search':
        loggable = fnName + ' ' + originalArgs[1];
        break;
      case 'get':
        loggable = fnName + ' ' + originalArgs[0];
        break;
    }

    logParams = {id: id, db: dbName, object: loggable};

    if (!metrics[loggable]){
      metrics[loggable] = {callCount: 0, totalTimeMs: 0, avgTimeMs: 0};
    }
    slowDbOp = setInterval(function(){
      logger.warn(logParams, 'Database operation in progress');
    }, SLOW_DB_REQ );

    stopWarning = setTimeout(function(){
      clearInterval(slowDbOp);
    }, STOP_DB_REQ_WARNINGS);

    if (typeof originalCallback === 'function'){
      originalArgs.push(profiledCallback);
    } else {
      originalArgs.push(profiledCallback);
    }
    orginalFn.apply(db, originalArgs);
  }

  db[fnName] = profiled;
}
function metricsIntervalFn(){
  var slowest = [0,''], mostCalled = [0,''], p;
  if (metrics._dirty){
    for (p in metrics){
      if (metrics[p].avgTimeMs > slowest[0]){
        slowest[0] = metrics[p].avgTimeMs;
        slowest[1] = p;
      }
      if (metrics[p].callCount > mostCalled[0]){
        mostCalled[0] = metrics[p].callCount;
        mostCalled[1] = p;
      }
    }
    var periodicMetrics = {
      slowest: slowest[1] + ' (' + slowest[0] + 'ms)',
      mostCalled: mostCalled[1] + ' (' + mostCalled[0] + ' times)'
    };
    logger.info(periodicMetrics, 'Database metrics');
    metrics._dirty = false;
  }
}
var metricsInterval = null;

module.exports = function(_logger, options){
  logger = _logger;
  if (options && options.profiling){
    metricsInterval = setInterval(metricsIntervalFn, 1 * MIN);
  }
  profile.clear = function(){
    clearInterval(metricsInterval);
  };
  return profile;
};