angular.module('myapp')
  .controller('WarningToastCtrl', ['$scope', 'msg', function ($scope, msg) {
    $scope.msg = msg;
  }]);

angular.module("myapp")
  .controller("HomeController", function ($rootScope, $scope, $stateParams, $state, MusicService, $log, UserService, $mdToast) {


    if (!$rootScope.user) {
      $state.go("signin")
    }


    MusicService.getMusic().then(function (result) {
      if (result)
        $scope.songs = result.data;

    }, function (err) {
      $log.error(err);
    });

    $scope.addToCollection = function (song) {

      var user = $rootScope.user;


      UserService.addToCollection(user, song).then(function (result) {
        if (result.data.inserted) {
          showCustomToast("Song added to collection!");
        } else if (result.data.existed) {
          showCustomToast("Song already in collection!");
        }
      }, function (err) {
        showCustomToast();
      });


    };


    function showCustomToast(msg) {
      $scope.msg = msg;
      $mdToast.show({
        hideDelay: 3000,
        position: 'top right',
        controller: 'WarningToastCtrl',
        locals: {msg: msg},
        templateUrl: '/app/public/views/toast.html'
      });
    };

  });