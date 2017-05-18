angular.module("myapp").service("MusicService", function ($log, ApiService) {


  this.getMusic = function () {
    var parameters = {};
    return ApiService.get("/sample");

  };

});