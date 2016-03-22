var app = angular.module('app', ['app.filters']);
app.controller('inputSelection', function($scope) {
  $scope.ipAddress = 'filler';
  $scope.ipFound = false;
  $scope.inputSelection = { hidden: false}
  $scope.toggleInputSelectionScreen = function() {
    window.retro.start();
    $scope.inputSelection.hidden = true;
    $scope.$apply();
  }

  window.toggleInputSelectionScreen = $scope.toggleInputSelectionScreen;

  document.querySelector('body').addEventListener('keydown', function (e) {
    console.log('da event triggurd: ', e);
  });

  document.getElementById('keyboardIcon').addEventListener('click', window.toggleInputSelectionScreen);

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
          $("#keyboardIcon").css("background-image", 'url(' + '../images/keyboard.png' + ')');
          new QRCode(document.getElementById('qrCode'), toQ);
        }

        $scope.ipFound = true;

        // force scope to update
        $scope.$apply()
      }
    });

  });

});

app.controller('gameSelection', function($scope) {
  $scope.gameSelection = { hidden: false}
  $scope.toggleGameSelectionScreen = function() {
    $scope.gameSelection.hidden = true;
    $scope.$apply();
  }
  window.toggleGameSelectionScreen = $scope.toggleGameSelectionScreen;

  $scope.selectedConsole = [];
  $scope.consoleList = [{
    id: 1,
    name: 'NES'
  }, {
    id: 2,
    name: 'SNES'
  }, {
    id: 3,
    name: 'GB'
  }, {
    id: 4,
    name: 'GBA'
  }];

  $scope.setSelectedConsole = function () {
    var id = this.console.id;
    if (_.contains($scope.selectedConsole, id)) {
      $scope.selectedConsole = _.without($scope.selectedConsole, id);
    } else {
      $scope.selectedConsole.push(id);
    }
    return false;
  };

  $scope.isChecked = function (id) {
    if (_.contains($scope.selectedConsole, id)) {
      return 'icon-ok pull-right';
    }
    return false;
  };

  $scope.checkAll = function () {
      $scope.selectedConsole = _.pluck($scope.consoleList, 'id');
  };

  $scope.games = window.gamesList;

});

angular.module('app.filters', []).filter('consoleFilter', [function () {
  return function (games, selectedConsole) {
    if (!angular.isUndefined(games) && !angular.isUndefined(selectedConsole) && selectedConsole.length > 0) {
      var tempGames = [];
      angular.forEach(selectedConsole, function (id) {
        angular.forEach(games, function (game) {
          if (angular.equals(game.console.id, id)) {
            tempGames.push(game);
          }
        });
      });
      return tempGames;
    } else {
      return games;
    }
  };
}]);

