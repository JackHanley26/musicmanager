var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('./'));

app.get('/', function (req, res) {
  var options = {
    root: __dirname + '/public',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
  res.sendFile('index.html', options, function (err) {
    if (err) {
      console.log("Error sending index.html")
    } else {
      console.log('Sent:', 'index.html');
    }
  });
});
var port = process.env.PORT = 3001;

app.listen(port, "0.0.0.0");

console.log("Listening on port " + port);