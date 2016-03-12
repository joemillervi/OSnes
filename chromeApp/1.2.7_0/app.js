angular.module('main',[])
.controller('mainCtrl', function($scope) {
  $scope.ipAddress = 'filler'
  $scope.title = 'TITLEEEE';

  // For testing keydown events
  // $('body').on('keydown', function (e) {
  //   console.log('event triggerd: ', e);
  // });

  document.querySelector('body').addEventListener('keydown', function (e) {
    console.log('da event triggurd: ', e);
  });

  chrome.system.network.getNetworkInterfaces(function (ipAddresses) {
    ipAddresses.forEach(function (ipAddress) {
      if (ipAddress.prefixLength === 12) {
        $scope.title = 'IP FOUND'
        $scope.ipAddress = ipAddress.address;
        // force scope to update
        $scope.$apply()
      }
    });

  });
});
