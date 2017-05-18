angular.module("myapp")
  .controller("HomeController", function ($rootScope, $scope, $stateParams, $state, MusicService, $log) {


    if (!$rootScope.user) {
      $state.go("signin")
    }


    MusicService.getMusic().then(function (result) {
      if (result)
        result.data[0].id = "one";
      $scope.songs = result.data;

    }, function (err) {
      $log.error(err);
    });

    $scope.addToCollection = function (user, song) {

    };

    SC.initialize({
      client_id: "YOUR-CLIENT-ID-HERE"
    });

    SC.get("/groups/55517/tracks", {
      limit: 5
    }, function(tracks) {
      for (var i = 0; i < tracks.length; i ++) {
        SC.stream( '/tracks/' + tracks[i].id, function( sm_object ){
          var track = {
            id: tracks[i].id,
            title: tracks[i].title,
            artist: tracks[i].genre,
            url: sm_object.url
          };

          $scope.$apply(function () {
            $scope.songs.push(track);
          });
        });
      }
    });



    /*$scope.songs = [
     {
     id: 'one',
     title: 'Rain',
     artist: 'Drake',
     url: 'http://www.schillmania.com/projects/soundmanager2/demo/_mp3/rain.mp3'
     },
     {
     id: 'one',
     title: 'Rise Again (Original Mix)',
     artist: 'Boston 168',
     artwork: 'public/images/boston-168.jpg',
     url: 'public/files/01 303 Regiment.mp3'
     }
     ]*/


  });