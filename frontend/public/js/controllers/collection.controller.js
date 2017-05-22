angular.module("myapp").controller("CollectionController", function ($rootScope, $scope, $stateParams, $state, $mdToast, $log, UserService) {


  if (!$rootScope.user) {
    $state.go("signin")
  }

  UserService.getUserCollection($rootScope.user).then(function (result) {
    if (result.data) {
      $scope.songs = result.data;
    } else {
      showCustomToast("You have no songs in your collection");
    }
  }, function (err) {
    showCustomToast("Error: " + err);
    $log.error(err);
  });

  $scope.removeFromCollection = function (song) {
    var user = $rootScope.user;
    UserService.removeFromCollection(user, song).then(function (result) {
      if (result.data.removed) {
        showCustomToast("Song removed from collection!");
        $scope.songs = result.data.songs;
      }
    }, function (err) {
      showCustomToast("Error: "+err);
    });
  };


  function showCustomToast(msg) {
    $mdToast.show({
      hideDelay: 3000,
      position: 'top right',
      controller: 'WarningToastCtrl',
      locals: {msg: msg},
      templateUrl: '/app/public/views/toast.html'
    });
  };

});