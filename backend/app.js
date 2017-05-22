var express = require('express');
var app = express();
var fs = require('fs');
var fileloader = require('./fileloader');
var decode = require('urldecode');
var cors = require('cors');

var corsOptions = {
  origin: '*'
};


app.use(cors(corsOptions));
app.options('*', cors());

app.get('/metadata', function (req, res) {
  fileloader.getMetadata(function (err, results) {
    if (err)throw err;
    res.send(results);
  });
});

app.get('/', function (req, res) {
  res.send('File Loader Running...');
});


app.get('/song/:url', function (req, res) {


  var file = decode(req.params.url);
  console.log(file);
  fs.exists(file, function (exists) {
    if (exists) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      var rstream = fs.createReadStream(file);
      rstream.pipe(res);
    }
    else {
      res.send("Its a 404");
      res.end();
    }
  });

});

app.get('/download', function (req, res) {
  var file = req.params.url;
  console.log(file);
  fs.exists(file, function (exists) {
    if (exists) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader('Content-disposition', 'attachment; filename=' + fileId);
      res.setHeader('Content-Type', 'application/audio/mpeg3');
      var rstream = fs.createReadStream(file);
      rstream.pipe(res);
    }
    else {
      res.send("Its a 404");
      res.end();
    }
  });
});


var port = process.env.PORT = 5000;

var server = app.listen(port, function () {
  var port = server.address().port;

  console.log("Example app listening on", port)
});