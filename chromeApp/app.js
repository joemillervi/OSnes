angular.module('main',[])
.controller('mainCtrl', function($scope) {
  $scope.ipAddress = 'filler';
  $scope.ipFound = false;
  $scope.title = 'TITLEEEE';
  $scope.emulator = { playing: false}
  $scope.togglePlaying = function() {
    $scope.emulator.playing = true;
    $scope.$apply();
  }

  window.togglePlaying = $scope.togglePlaying;

  // For testing keydown events
  // $('body').on('keydown', function (e) {
  //   console.log('event triggerd: ', e);
  // });

  $("#qrCode").css("border-color", "white");
  $("#qrTitle").text("Scan QR");

  // $("#qrCode").css("border-color", "white");
  $("#keyboardTitle").text("Click keyboard");


  document.querySelector('body').addEventListener('keydown', function (e) {
    console.log('da event triggurd: ', e);
  });

  chrome.system.network.getNetworkInterfaces(function (ipAddresses) {
    ipAddresses.forEach(function (ipAddress) {
      if (ipAddress.prefixLength <= 28 && ipAddress.name === "en0") {
        $scope.title = 'IP FOUND'

        $scope.ipAddress = ip4 = ipAddress.address;
        var toQ = $scope.ipAddress + ':' + port;
        if($scope.ipFound === false) {
          new QRCode(document.getElementById('qrCode'), toQ);
        }

        $scope.ipFound = true;

        // force scope to update
        $scope.$apply()
      }
    });

  });
});
