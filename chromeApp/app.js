//main app module
var app = angular.module('app', ['app.filters']);

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

//Allows us to use data-ng-src in chrome app
app.config([
  '$compileProvider',
  function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|blob|chrome-extension):|data:image\/)/);
  }
]);

//inputSelection screen
app.controller('inputSelection', function($scope) {
  $scope.ipAddress = 'filler';
  $scope.ipFound = false;
  // $scope.inputSelection = { hidden: false}
  $scope.toggleInputSelectionScreen = function() {
    window.retro.start();
    // $scope.inputSelection.hidden = true;
    inputSelectionScreen = document.getElementById('inputSelectionScreen');
    inputSelectionScreen.classList.add('hidden');
    $scope.$apply();
  }

  var qrScreen = document.getElementById('qrScreen');
  $scope.openQRScreen = function() {
    qrScreen.classList.remove('hidden');
  };
  $scope.closeQRScreen = function() {
    console.log('close click');
    qrScreen.classList.add('hidden');
  };

  window.toggleInputSelectionScreen = $scope.toggleInputSelectionScreen;
  window.openQRScreen = $scope.openQRScreen;

  //show keydown events for debugging purposes
  document.querySelector('body').addEventListener('keydown', function (e) {
    console.log('keydown: ', e);
  });

  //Handle Keyboard Icon 
  document.getElementById('keyboardIcon').addEventListener('click', window.toggleInputSelectionScreen);
  document.getElementById('keyboardIcon').addEventListener('mouseover', function() {
    $("#keyboardIcon").css('background-image', 'url(' + '../img/desktopiconhighlight.png' + ')');
  });
  document.getElementById('keyboardIcon').addEventListener('mouseout', function() {
    $("#keyboardIcon").css('background-image', 'url(' + '../img/desktopicondark.png' + ')');
  });

  //Handle Mobile Icon
  document.getElementById('mobileIcon').addEventListener('click', window.openQRScreen);
  document.getElementById('mobileIcon').addEventListener('mouseover', function() {
    $("#mobileIcon").css('background-image', 'url(' + '../img/desktopwithmobileiconhighlight.png' + ')');
  });
  document.getElementById('mobileIcon').addEventListener('mouseout', function() {
    $("#mobileIcon").css('background-image', 'url(' + '../img/desktopwithmobileicondark.png' + ')');
  });


  chrome.system.network.getNetworkInterfaces(function (ipAddresses) {
    ipAddresses.forEach(function (ipAddress) {
      console.log(ipAddress);
      if (ipAddress.prefixLength < 64 && ipAddress.name === "en0") {
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

//gameController Screen
app.controller('gameSelection', function($scope, $http) {
  //used to hide and show the game selection screen
  // $scope.gameSelection = { hidden: false}
  $scope.toggleGameSelectionScreen = function() {
    gameSelectionScreen = document.getElementById('gameSelection');
    gameSelectionScreen.classList.add('hidden');
    // $scope.gameSelection.hidden = true;
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
  
  //Fetches ROM data from ipfs, converts to readable method for emulator, loads in the ROM
  var loading = document.getElementById('loading');
  $scope.getRom = function (game) {
    console.log('game', game);
    loading.classList.remove('hidden');
    return $http({
      method: 'GET',
      url: game.link,
      responseType: 'arraybuffer'
    }).then(function successCallback(response) {
        window.loadData(game.link.split("/")[5], new Uint8Array(response.data));
      }, function errorCallback(response) {
        console.log('failuuuure', response);
      });
  }
  
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

//pause game screen
app.controller('pauseScreen', function($scope) {
  $scope.chooseNewGame = function () {
    window.chooseNewGame();
  }

  window.systemSettings = {
    "extensions": {
      "gb": "gambatte",
      "gbc": "gambatte",
      "smc": "snes9x-next",
      "fig": "snes9x-next",
      "sfc": "snes9x-next",
      "swc": "snes9x-next",
      "gba": "vba-next",
      "nes": "quicknes",
      "sms": "picodrive",
      "gen": "picodrive",
      "smd": "picodrive",
      "md": "picodrive",
      "32x": "picodrive",
      "mgw": "gw",
      "vec": "vecx"
    },
    "overlays": {
      "gambatte": "./overlays/gamepads/gameboy/",
      "vba-next": "./overlays/gamepads/gba/",
      "snes9x-next": "./overlays/gamepads/snes/",
      "nestopia": "./overlays/gamepads/nes/"
    },
    "keys": {
      //Default Key settings:
      //IJKL Keys
      "75": "0",  //B
      "76": "1",  //A
      "74": "2",  //Y
      "73": "3",  //X
      //E, U
      "69": "4",  //L
      "85": "5",  //R
      //Enter, Shift
      "16": "8",  //Select
      "13": "9",  //Start
      //WASD keys
      "87": "12",  //Up
      "83": "13",  //Down
      "65": "14",  //Left
      "68": "15", //Right
      //arrow keys double mapping
      "38": "12",  //Up
      "40": "13",  //Down
      "37": "14",  //Left
      "39": "15", //Right

      //Keys reserved for mobilecontroller; seldom used keys
      //IJKL Keys
      "180": "0",  //B
      "181": "1",  //A
      "182": "2",  //Y
      "183": "3",  //X

      //E, U
      "184": "4",  //L
      "185": "5",  //R

      //Enter, Shift
      "188": "8",  //Select
      "189": "9",  //Start
      
      //WASD keys
      "190": "12",  //Up
      "191": "13",  //Down
      "192": "14",  //Left
      "193": "15", //Right
    },
    "urlPrefix": "https://crossorigin.me/"
  }; 

  $scope.keys = {};
  systemSettings.keys['70'] = '0';
});


