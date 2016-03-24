var app = angular.module('app', ['app.filters']);

//Allows us to use data-ng-src in chrome app
app.config([
  '$compileProvider',
  function ($compileProvider) {
      //  Default imgSrcSanitizationWhitelist: /^\s*((https?|ftp|file|blob):|data:image\/)/
      //  chrome-extension: will be added to the end of the expression
      $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);

  }
]);

app.controller('inputSelection', function($scope) {
  $scope.ipAddress = 'filler';
  $scope.ipFound = false;
  $scope.inputSelection = { hidden: false}
  $scope.toggleInputSelectionScreen = function() {
    window.retro.start();
    $scope.inputSelection.hidden = true;
    inputSelectionScreen = document.getElementById('inputSelectionScreen');
    inputSelectionScreen.classList.add('hidden');
    $scope.$apply();
  }

  window.toggleInputSelectionScreen = $scope.toggleInputSelectionScreen;

  //show keydown events for debugging purposes
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
          //QR code takes a while to render but we want everything to show up together so we use jQuery to make the rest of the screen show when QR is ready
          $("#qrTitle").text("Play on Mobile");
          $("#qrCode").css("border-color", "white");
          $("#qrInstructions").text("Scan QR");

          $("#keyboardTitle").text("Play on Desktop");
          $("#keyboardIcon").css("border-color", "white");
          $("#keyboardInstructions").text("Click keyboard");
          $("#keyboardIcon").css("background-color", 'black');
          $("#keyboardIcon").css("background-image", 'url(' + '../img/keyboard.png' + ')');
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
  //used to hide and show the game selection screen
  $scope.gameSelection = { hidden: false}
  $scope.toggleGameSelectionScreen = function() {
    $scope.gameSelection.hidden = true;
    $scope.$apply();
  }
  window.toggleGameSelectionScreen = $scope.toggleGameSelectionScreen;

  document.getElementById('searchBar').addEventListener('focusin', function() {
    $("#searchBar").css("border-color", "#9767ab");
    $("#filterButton").css("border-left-color", "#9767ab");
    $("#filterButton").css("border-top-color", "#9767ab");
    $("#filterButton").css("border-bottom-color", "#9767ab");
  });

  document.getElementById('searchBar').addEventListener('focusout', function() {
    $("#searchBar").css("border-color", "#cccccc");
    $("#filterButton").css("border-color", "#cccccc");
  });
  


  
  //list of available consoles: used to filter list of games
  $scope.consoleList = [{
    id: 1,
    name: 'NES',
  }, {
    id: 2,
    name: 'SNES',
  }, {
    id: 3,
    name: 'GB',

  }, {
    id: 4,
    name: 'GBA',
  }];

  //initialize showing all consoles/games
  $scope.selectedConsole = [1,2,3,4]; 
  
  //'import' list of games to render from gamesList.js
  $scope.games = window.gamesList;

  //methods to filter and show games from the list
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

  //
  $scope.getIcon = function (id) {
    if(id===1) {
      return './img/nes.png';
    } else if (id===2) {
      return './img/snes.png';
    } else if (id===3) {
      return './img/gameboy.png';
    } else if (id===4) {
      return './img/gameboyadvance.png';
    }
  }

});

//used as filter in index.html
angular.module('app.filters', []).filter('consoleFilter', [function () {
  return function (games, selectedConsole) {
    var gamestoShow = [];
    angular.forEach(selectedConsole, function (id) {
      angular.forEach(games, function (game) {
        if (angular.equals(game.console.id, id)) {
          gamestoShow.push(game);
        }
      });
    });
    return gamestoShow;
  };
}]);



