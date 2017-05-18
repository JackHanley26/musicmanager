angular.module("myapp").controller("SigninController", function ($rootScope, $scope, $state, $cookies) {


  $scope.signin = function (form) {

    var user = {
      email: $scope.vm.formData.email,
      password: $scope.vm.formData.password
    };

    //find out if this user exists


    $rootScope.user = user;

    $cookies.put('musicplayerlogin', user);
    $state.go("home")
  }

});