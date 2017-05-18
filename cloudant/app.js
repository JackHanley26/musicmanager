//
// /**
//  * Module dependencies
//  */
//
// var express = require('express'),
//   bodyParser = require('body-parser'),
//   http = require('http'),
//   path = require('path');
//
// var app = express();
//
//
// var port = (process.env.VCAP_APP_PORT || 4001);
//
// /**
//  * Configuration
//  */
//
// app.use(express.static(__dirname +'/public')); // set the static files location
//
// app.use(bodyParser.urlencoded({
//   'extended' : 'true'
// })); // parse application/x-www-form-urlencoded
// app.use(bodyParser.json()); // parse application/json
//
//
// /**
//  * Routes
//  */
//
//
// //express rewrites for html 5???
// app.use(function(req, res) {
//   res.sendFile('index.html', {root : './public'});
// });
//
//
// /**
//  * Start Server
//  */
//
// var httpServer = http.createServer(app);
//
// httpServer.listen(port);
// console.log("Running on port " + port);


var express = require('express');
var app = express();
var path = require('path');


// api routes
require('./api/app.js')(app);


var port = process.env.PORT = "4001";
var dbName = process.env.DATABASE = "music";

app.get('/database_name', function (req, res) {
  console.log("Sending DATABASE_NAME: " + dbName);
  return dbName;
});

app.use(express.static('./'));


app.listen(port, function () {
  console.log('Cloudant ['+dbName+'] listening on port ' + port)
});