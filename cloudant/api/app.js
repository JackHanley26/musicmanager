var music = require('../modules/music/music');
var users = require('../modules/users/users');
var converter = require('number-to-words');
var _ = require('lodash');
//required for cross site
var cors = require('cors');
var corsOptions = {
  origin: '*'
};


module.exports = function (app) {

  app.use(cors(corsOptions));
  app.options('*', cors());

  app.post('/getUser', function (req, res, next) {
    if (!req.body || _.isEmpty(req.body)) {
      console.log('There is no data informed.');
      return res.status(204).send({"error": "No data informed."});
    }
    if (!req.body.user) {
      console.log('Missing required data.');
      return res.status(204).send({"error": "Missing required data."});
    }
    var user = req.body.user;
    var username = user.username;
    var password = user.password;

    users.getUser(username, password, function (err, result) {
      if (err) {

      }
      res.send(result);
    });
  });

  app.post('/addToCollection', function (req, res, next) {
    if (!req.body || _.isEmpty(req.body)) {
      console.log('There is no data informed.');
      return res.status(204).send({"error": "No data informed."});
    }
    if (!req.body.user || !req.body.song) {
      console.log('Missing required data.');
      return res.status(204).send({"error": "Missing required data."});
    }
    users.addToCollection(req.body.user, req.body.song, function (err, result) {

      if (err) {
        res.statusCode('503').send(err);
      }
      var i = 1;
      _.forEach(result.collection, function (song) {
        song.id = converter(i);
      });

      res.send(result);
    });

  });

  app.post('/getCollection', function (req, res, next) {
    if (!req.body || _.isEmpty(req.body)) {
      console.log('There is no data informed.');
      return res.status(204).send({"error": "No data informed."});
    }
    if (!req.body.user) {
      console.log('Missing required data.');
      return res.status(204).send({"error": "Missing required data."});
    }

    users.getCollection(req.body.user.username, req.body.user.password, function (err, result) {
      if (err) {
        res.send(err);
      }
      res.send(result);
    })
  });

  app.post('/removeFromCollection', function (req, res, next) {
    if (!req.body || _.isEmpty(req.body)) {
      console.log('There is no data informed.');
      return res.status(204).send({"error": "No data informed."});
    }
    if (!req.body.user || !req.body.song) {
      console.log('Missing required data.');
      return res.status(204).send({"error": "Missing required data."});
    }
    users.removeFromCollection(req.body.user, req.body.song, function (err, result) {
      if (err) {
        res.statusCode(503).send(err)
      }
      res.send(result)
    })

  })

};