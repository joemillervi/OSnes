angular.module('main',[])
.controller('mainCtrl', function($scope) {
  $scope.ipAddress = 'filler';
  $scope.ipFound = false;
  $scope.emulator = { playing: false}
  $scope.togglePlaying = function() {
    $scope.emulator.playing = true;
    $scope.$apply();
  }

  window.togglePlaying = $scope.togglePlaying;

  document.querySelector('body').addEventListener('keydown', function (e) {
    console.log('da event triggurd: ', e);
  });

  chrome.system.network.getNetworkInterfaces(function (ipAddresses) {
    ipAddresses.forEach(function (ipAddress) {
      console.log(ipAddress);
      if (ipAddress.prefixLength < 64 && ipAddress.name === "en0") {
        $scope.title = 'IP FOUND'

        $scope.ipAddress = ip4 = ipAddress.address;
        var toQ = $scope.ipAddress + ':' + port;

        if($scope.ipFound === false) {

          $("#qrTitle").text("Play on Mobile");
          $("#qrCode").css("border-color", "white");
          $("#qrInstructions").text("Scan QR");

          $("#keyboardTitle").text("Play on Desktop");
          $("#keyboardIcon").css("border-color", "white");
          $("#keyboardInstructions").text("Click keyboard");
          $("#keyboardIcon").css("background-color", 'black');
          $("#keyboardIcon").css("background-image", 'url(' + './keyboard.png' + ')');
          new QRCode(document.getElementById('qrCode'), toQ);
        }

        $scope.ipFound = true;

        // force scope to update
        $scope.$apply()
      }
    });

  });
});
