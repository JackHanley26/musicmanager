// Load the Cloudant library.
var Cloudant = require('cloudant');
var domain = require("domain");


var dbConfig = require("../../db/lib/db.config");
var db = dbConfig.db;
var d = dbConfig.d;
var dbAccessMethods = require("./../../db/lib/db.access");
// var uuidV4 = require("uuid/v4");
var _ = require("lodash");
var logger = require("./../../api/logger").logger;


var d = domain.create();
var me = 'jackhanley'; // Set this to your own account
var password = 'pull1213';

// Initialize the library with my account.
var cloudant = Cloudant({account: me, password: password});


function getMusic(cb) {

  var startkey = [];
  var endkey = [];
  startkey.push([]);

  d.run(function () {

    var params = {
      descending: "true",
      reduce: "false",
      include_docs: "true",
      startkey: startkey,
      endkey: endkey
    };

    db["music"].db.view('musicmanager', 'getMusic', params, function (err, results) {
      if (err) {
        logger.error({
          err: err
        });
        return cb(err);
      }

        var music = results.rows.map(function (item) {
          return item.doc;
        });



      return cb(null, music);
    })

  });

}


module.exports = {
  getMusic: getMusic
};