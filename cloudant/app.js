var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');



app.use(bodyParser.urlencoded({
  'extended' : 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// api routes
require('./api/app.js')(app);


var port = process.env.PORT || "4001";

app.use(express.static('./'));
app.get("/", function (req, res) {
  res.send("<html><body>Database micro service running...</body></html>")
});


app.listen(port, function () {
  console.log('Cloudant listening on port ' + port)
});