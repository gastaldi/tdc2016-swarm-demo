'use strict';

angular.module('myapp',['ngRoute','ngResource'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/',{templateUrl:'views/landing.html',controller:'LandingPageController'})
      .when('/Offers',{templateUrl:'views/Offer/search.html',controller:'SearchOfferController'})
      .when('/Offers/new',{templateUrl:'views/Offer/detail.html',controller:'NewOfferController'})
      .when('/Offers/edit/:OfferId',{templateUrl:'views/Offer/detail.html',controller:'EditOfferController'})
      .otherwise({
        redirectTo: '/'
      });
  }])
  .controller('LandingPageController', function LandingPageController() {
  })
  .controller('NavController', function NavController($scope, $location) {
    $scope.matchesRoute = function(route) {
        var path = $location.path();
        return (path === ("/" + route) || path.indexOf("/" + route + "/") == 0);
    };
  });

var keycloak = new Keycloak('keycloak.json');

angular.element(document).ready(function() {
  keycloak.init({ onLoad: 'login-required' }).success(function () {
    angular.bootstrap(document, ["myapp"]);
  }).error(function () {
    console.log("ERROR");
  });
});


angular.module('myapp').factory('authInterceptor', function($q) {
  return {
    request: function (config) {
      var deferred = $q.defer();
      if (keycloak.token) {
        keycloak.updateToken(5).success(function() {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + keycloak.token;
          deferred.resolve(config);
        }).error(function() {
          deferred.reject('Failed to refresh token');
        });
      }
      return deferred.promise;
    }
  };
});

angular.module('myapp').config(function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.interceptors.push('authInterceptor');
});
