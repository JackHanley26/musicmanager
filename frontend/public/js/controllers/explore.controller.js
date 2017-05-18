angular.module("myapp").controller("ExploreController", function ($rootScope, $scope, $state) {


  if(!$rootScope.user){
    $state.go("signin")
  }


  $scope.vm = {
    formData: {
      email: 'hello@patternry.com',
      password: 'foobar'
    }
  };
});