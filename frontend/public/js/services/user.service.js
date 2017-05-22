angular.module("myapp").service("UserService", function (ApiService, $http) {

  var URL = "http://localhost:4001";

  this.login = function (user) {
    var parama = {
      user: user
    };
    return ApiService.post(URL + "/getUser", parama);
  };

  this.addToCollection = function (user, song) {
    var parama = {
      user: user,
      song: song
    };
    return ApiService.post(URL + "/addToCollection", parama);
  };

  this.getUserCollection = function (user) {
    var parms = {
      user: user
    };
    return ApiService.post(URL + "/getCollection", parms);
  };


  this.removeFromCollection = function (user, song) {
    var parms = {
      user: user,
      song: song
    };
    return ApiService.post(URL + "/removeFromCollection", parms);
  }

});
