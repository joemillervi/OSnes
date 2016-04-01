//error screen
app.controller('errorScreen', function($scope) {
  $scope.restart = function () {
    chrome.runtime.reload();
  };
});