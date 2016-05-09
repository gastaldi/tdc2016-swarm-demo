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

var auth = {
  loggedIn : false,
  authz : new Keycloak('keycloak.json')
}

angular.element(document).ready(function() {
  auth.authz.init({ onLoad: 'login-required' }).success(function () {
    auth.loggedIn = true;
    angular.bootstrap(document, ["myapp"]);
  }).error(function () {
    console.log("ERROR");
  });
});


angular.module('myapp').factory('authInterceptor', function($q) {
  return {
    request: function (config) {
      var deferred = $q.defer();
      if (auth.authz.token) {
        auth.authz.updateToken(5).success(function() {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer ' + auth.authz.token;
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
