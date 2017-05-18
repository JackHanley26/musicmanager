var music = require('../modules/music/music');

var cors = require('cors');

var corsOptions = {
  origin: '*'
};



module.exports = function (app) {

  app.use(cors(corsOptions));
  app.options('*', cors());

  app.get('/sample', function (req, res, next) {
    music.getMusic(function (err, result) {
      res.send(result);
    })
  });
};