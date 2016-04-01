//main app module
window.app = app = angular.module('app', [
  'app.filters'
])
.config([ //Allows us to use data-ng-src in chrome app
  '$compileProvider',
  function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);
  }
]);


