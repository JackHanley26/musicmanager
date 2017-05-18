var fs = require("fs");
var files = fs.readdirSync(__dirname + "/lib");
var db_exports = [];
for (var j = 0; j < files.length; j++) {
  if (/([a-zA-Z]|[0-9])+.js$/.test(files[j])) {
    db_exports.push(require("./lib/" + files[j]));
  }
}
for (var i = 0; i < db_exports.length; i++) {
  for (var x in db_exports[i]) {
    module.exports[x] = db_exports[i][x];
  }
}