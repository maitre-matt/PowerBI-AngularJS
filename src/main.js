/// <reference path="index.html" />

require.config({
  paths: {
    'adal': 'bower_components/adal-angular/dist/adal.min',
    'adal-angular': 'bower_components/adal-angular/dist/adal-angular.min',
    'angular': 'bower_components/angular/angular.min',
    'angular-route': 'bower_components/angular-route/angular-route.min',
    'css': 'bower_components/require-css/css',
    'domReady': 'bower_components/requirejs-domready/domReady'
  },
  shim: {
    'adal-angular': ['adal', 'angular'],
    'angular': {
      exports: 'angular'
    },
    'angular-route': ['angular']
  },
});

require([
  'domReady!',
  'angular',
  'angular-route',
  'adal-angular',
  'css!bower_components/bootstrap/dist/css/bootstrap',
  'css!bower_components/fontawesome/css/font-awesome',
  'css!main'
], function (doc, angular) {
  'use strict';

  var app = angular.module('App', ['ngRoute', 'AdalAngular']);

  app.config(['$httpProvider', '$routeProvider', '$sceDelegateProvider', 'adalAuthenticationServiceProvider', function ($httpProvider, $routeProvider, $sceDelegateProvider, adalProvider) {

    adalProvider.init(
      {
        tenant: "72f988bf-86f1-41af-91ab-2d7cd011db47", // microsoft.onmicrosoft.com
        clientId: "92f12926-5cf0-4460-83b6-14366bbaa88a", // Power BI AngularJS SPA
        endpoints: {
          "https://api.powerbi.com": "https://analysis.windows.net/powerbi/api",
        },
        requireADLogin: true,
        cacheLocation: 'localStorage' // enable this for IE, as sessionStorage does not work for localhost
      },
      $httpProvider
    );

    $routeProvider.when('/', {
      templateUrl: 'main.html',
      controller: 'Main'
    }).otherwise({
      redirectTo: '/'
    });

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://*.powerbi.com/**'
    ]);

  }]);

  app.controller('Main', ['$scope', '$http', 'adalAuthenticationService', function ($scope, $http, adal) {

    var iframe = document.getElementById("report");
    iframe.addEventListener("load", function () {
      var token = adal.getCachedToken("https://analysis.windows.net/powerbi/api");
      iframe.contentWindow.postMessage(JSON.stringify({ action: "loadReport", accessToken: token }), "*");
    });

    // Get the list of workspaces
    $http.get('https://api.powerbi.com/beta/myorg/groups').then(function (response) {
      $scope.workspaces = [{ name: 'My Workspace', id: null }].concat(response.data.value);
    }, function (error) {
      $scope.workspaceError = error;
    });

    // Update reports when a new workspace is selected
    $scope.$watch('selectedWorkspace', function (selectedWorkspace) {

      $scope.selectedReport = null
      $scope.reports = null;

      // Get the list of reports
      $http.get('https://api.powerbi.com/beta/myorg/' + (selectedWorkspace ? 'groups/' + selectedWorkspace + '/reports' : 'reports')).then(function (response) {
        $scope.reports = response.data.value;
        $scope.selectedReport = $scope.reports[0].embedUrl;
      }, function (error) {
        $scope.reportError = error;
      });

    });

  }]);

  angular.bootstrap(doc.getElementById('root'), ['App']);
});
