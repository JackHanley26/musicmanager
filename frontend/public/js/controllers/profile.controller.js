angular.module("myapp").controller("ProfileController", function ($rootScope, $scope, $state) {

  if(!$rootScope.user){
    $state.go("signin")
  }

});