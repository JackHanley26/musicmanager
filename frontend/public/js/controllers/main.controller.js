angular.module('myapp').controller("MainController", function ($scope, $state, $stateParams, $log, $rootScope, ApiService, $cookies) {


  function loadUserFromCookies() {
    var user = $cookies.get('musicplayerlogin');
    var pass = $cookies.get('musicplayerpassword');
    var userObj = {
      username: user,
      password: pass
    };
    if (user) {
      $rootScope.user = userObj;
      $scope.userloggedin = true;
    }
  }

  loadUserFromCookies();

  $scope.goto = function (page) {
    $state.go(page);
  };

  $scope.logout = function () {

    if ($rootScope.user) {
      delete $rootScope.user;
      $cookies.remove("musicplayerlogin");
      $state.go('home');
      $state.reload();
    }
    if ($scope.currentPlaying) {
      $scope.currentPlaying = null;
    }
  }

});