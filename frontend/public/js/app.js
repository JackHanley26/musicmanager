'use strict';

// Declare app level module which depends on filters, and services

var app = angular.module('myapp', [
  'ui.router',
  'ngAria',
  'ngMaterial',
  'ngAnimate',
  'ui.bootstrap',
  'angularSoundManager',
  'ngCookies'
]);

app.config(function ($stateProvider, $locationProvider) {

  $stateProvider
    .state('home', {
      templateUrl: '/app/public/views/home.html',
      controller: 'HomeController'
    })
    .state('collection', {
      templateUrl: '/app/public/views/collection.html',
      controller: 'CollectionController'
    })
    .state('explore', {
      templateUrl: '/app/public/views/signin.html',
      controller: 'ExploreController'
    })
    .state('profile', {
      templateUrl: '/app/public/views/profile.html',
      controller: 'ProfileController'
    })
    .state("signin",{
      templateUrl : '/app/public/views/signin.html',
      controller: 'SigninController'
    })
  ;


  $locationProvider.html5Mode(true);
});


app.run(function ($state) {
  $state.go('home');
});