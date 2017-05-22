var recursive = require("recursive-readdir");
var fs = require('fs');
var mm = require('musicmetadata');
var _ = require("lodash");
var converter = require('number-to-words');
var async = require("async");
var urlencode = require('urlencode');

var folder = "/app/music"; //docker
//var folder = ".//music";

var getMetadata = function (cb) {
  async.waterfall([
    function getListOfFiles(waterfallCB) {
      recursive(folder, function (err, files) {
        if (err)throw err;
        // files = files.slice(0,100);
        var filtered = files.filter(isMusicFile);

        return waterfallCB(null, filtered);
      });
    },
    function (files, waterfallCB) {
      var index = 1;
      async.map(files, createMetadata, function (err, result) {
        index = index + 1;
        if (err)
          return waterfallCB(err);
        return waterfallCB(null, result);
      });
    }
  ], function (err, songs) {
    if (err)
      return cb(err);
    var songs = songs.filter(isNotNull);
    var id = 1;
    _.forEach(songs, function (song) {
      song.id = converter.toWords(id);
      id = id + 1;
    });

    return cb(null, songs)
  });

};

function createMetadata(file, cb) {
  var parser = mm(fs.createReadStream(file), function (err, metadata) {
    if (err) {
      cb(null, null);
    } else {
      metadata.url = "http://localhost:5000/song/" + urlencode(file);
      metadata.artist = metadata.artist[0];
      delete metadata.picture;
      delete metadata.disk;

      cb(null, metadata)
    }
  });
}
function isMusicFile(file) {
  return file.indexOf(".mp3") !== -1 ||
    file.indexOf(".m4a") !== -1 ||
    file.indexOf(".aac") !== -1 ||
    file.indexOf(".wma") !== -1 ||
    file.indexOf(".wmv") !== -1 ||
    file.indexOf(".ogg") !== -1 ||
    file.indexOf(".flac") !== -1
}

function isNotNull(file) {
  return file;
}

module.exports = {
  getMetadata: getMetadata
};