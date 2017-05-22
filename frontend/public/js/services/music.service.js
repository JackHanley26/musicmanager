angular.module("myapp").service("MusicService", function ($log, ApiService) {


  this.getMusic = function () {
    return ApiService.get("http://localhost:5000/metadata");
  };

  this.getSong = function (url) {
    return ApiService.get("http://localhost:5000/song/"+url)
  }

});