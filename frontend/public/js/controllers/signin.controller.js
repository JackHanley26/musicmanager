angular.module("myapp").controller("SigninController", function ($rootScope, $scope, $state, $cookies, UserService) {


  $scope.signin = function () {

    var user = {
      username: $scope.vm.formData.email,
      password: $scope.vm.formData.password
    };

    $scope.disableLogin = true;

    UserService.login(user).then(function (result) {
      if (result.data) {
        $scope.loginerror = "Successful";
        var user = {
          username: result.data.username,
          password: result.data.password
        };
        $rootScope.user = user;
        $cookies.put('musicplayerlogin', user.username);
        $cookies.put('musicplayerpassword', user.password);
        $state.go("home");
      } else {
        console.log("Could not find user");
        $scope.loginerror = "User and password did not match!";
      }
      $scope.disableLogin = false;
    }, function (err) {
      console.log("Could not find user", err);
      $scope.loginerror = "Error: " + err;
      $scope.disableLogin = false;
    });
  }
});