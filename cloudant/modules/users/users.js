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


function getUser(username, password, cb) {

  var startkey = [username, password];
  var endkey = [username, password];
  startkey.push([]);

  d.run(function () {

    var params = {
      descending: "true",
      reduce: "false",
      include_docs: "true",
      startkey: startkey,
      endkey: endkey
    };

    db["users"].db.view('users', 'getUser', params, function (err, results) {
      if (err) {
        logger.error({
          err: err
        });
        return cb(err);
      }

      if (results.rows[0]) {
        return cb(null, results.rows[0].doc);

      } else {
        return cb(null, null);
      }
    })

  });

}
function getCollection(username, password, cb) {
  getUser(username, password, function (err, result) {
    if (err) {
      return cb(err);
    }
    return cb(null, result.collection);
  });
}

function addToCollection(user, song, cb) {
  getUser(user.username, user.password, function (err, user) {

    var res = {
      inserted: false,
      existed: false
    };

    if (!_.find(user.collection, {title: song.title, artist: song.artist})) {
      user.collection.push(song);
      db['users'].db.insert(user, function (err, body) {
        if (err) {
          return cb(err);
        }
        res.inserted = true;
        return cb(null, res);
      });
    } else {
      res.existed = true;
      return cb(null, res)
    }
  });
}

function removeFromCollection(user, song, cb) {
  getUser(user.username, user.password, function (err, user) {

    var res = {
      removed: false
    };
    _.forEach(user.collection, function (s, index) {
      if (s && s.title == song.title && s.artist == song.artist) {
        user.collection.splice(index, 1);
        res.removed = true;
      }
    });

    db['users'].db.insert(user, function (err, body) {
      if (err) {
        res.inserted = false;
        return cb(null, res);
      }
      res.inserted = true;
      res.songs = user.collection;
      return cb(null, res);
    });

  });
}


module.exports = {
  getUser: getUser,
  getCollection: getCollection,
  addToCollection: addToCollection,
  removeFromCollection: removeFromCollection
};