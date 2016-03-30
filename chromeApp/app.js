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
  // document.querySelector('body').addEventListener('keydown', function (e) {
  //   console.log('keydown: ', e);
  // });

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
      //Default keyboard key settings:
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
      "59": "0",  //B
      "61": "1",  //A
      "108": "2",  //Y
      "173": "3",  //X

      "181": "4",  //L
      "182": "5",  //R

      "183": "8",  //Select
      "226": "9",  //Start
      
      "230": "12",  //Up
      "233": "13",  //Down
      "234": "14",  //Left
      "255": "15", //Right
    },
    "urlPrefix": "https://crossorigin.me/"
  }; 

  var keyCodes = {
    3 : "break",
    8 : "backspace / delete",
    9 : "tab",
    12 : 'clear',
    13 : "enter",
    16 : "shift",
    17 : "ctrl ",
    18 : "alt",
    19 : "pause/break",
    20 : "caps lock",
    27 : "escape",
    32 : "spacebar",
    33 : "page up",
    34 : "page down",
    35 : "end",
    36 : "home ",
    37 : "left arrow ",
    38 : "up arrow ",
    39 : "right arrow",
    40 : "down arrow ",
    41 : "select",
    42 : "print",
    43 : "execute",
    44 : "Print Screen",
    45 : "insert ",
    46 : "delete",
    48 : "0",
    49 : "1",
    50 : "2",
    51 : "3",
    52 : "4",
    53 : "5",
    54 : "6",
    55 : "7",
    56 : "8",
    57 : "9",
    // 59 : "semicolon (firefox), equals",
    60 : "<",
    // 61 : "equals (firefox)",
    63 : "ß",
    65 : "a",
    66 : "b",
    67 : "c",
    68 : "d",
    69 : "e",
    70 : "f",
    71 : "g",
    72 : "h",
    73 : "i",
    74 : "j",
    75 : "k",
    76 : "l",
    77 : "m",
    78 : "n",
    79 : "o",
    80 : "p",
    81 : "q",
    82 : "r",
    83 : "s",
    84 : "t",
    85 : "u",
    86 : "v",
    87 : "w",
    88 : "x",
    89 : "y",
    90 : "z",
    91 : "Windows Key / Left ⌘ / Chromebook Search key",
    92 : "right window key ",
    93 : "Windows Menu / Right ⌘",
    96 : "numpad 0 ",
    97 : "numpad 1 ",
    98 : "numpad 2 ",
    99 : "numpad 3 ",
    100 : "numpad 4 ",
    101 : "numpad 5 ",
    102 : "numpad 6 ",
    103 : "numpad 7 ",
    104 : "numpad 8 ",
    105 : "numpad 9 ",
    106 : "multiply ",
    107 : "add",
    // 108 : "numpad period (firefox)",
    109 : "subtract ",
    110 : "decimal point",
    111 : "divide ",
    112 : "f1 ",
    113 : "f2 ",
    114 : "f3 ",
    115 : "f4 ",
    116 : "f5 ",
    117 : "f6 ",
    118 : "f7 ",
    119 : "f8 ",
    120 : "f9 ",
    121 : "f10",
    122 : "f11",
    123 : "f12",
    124 : "f13",
    125 : "f14",
    126 : "f15",
    127 : "f16",
    128 : "f17",
    129 : "f18",
    130 : "f19",
    144 : "num lock ",
    145 : "scroll lock",
    160 : "^",
    163 : "#",
    167 : "page forward (Chromebook)",
    171 : "~ + * key",
    // 173 : "minus (firefox), mute/unmute",
    174 : "decrease volume level",
    175 : "increase volume level",
    176 : "next",
    177 : "previous",
    178 : "stop",
    179 : "play/pause",
    180 : "e-mail",  //
    // 181 : "mute/unmute (firefox)", 
    // 182 : "decrease volume level (firefox)", 
    // 183 : "increase volume level (firefox)", 
    186 : "semi-colon / ñ",
    187 : "equal sign ",
    188 : "comma",
    189 : "dash ",
    190 : "period ",
    191 : "forward slash / ç",
    192 : "grave accent ",
    193 : "?, / or °",
    194 : "numpad period (chrome)",
    219 : "open bracket ",
    220 : "back slash ",
    221 : "close bracket ",
    222 : "single quote ",
    223 : "`",
    224 : "left or right ⌘ key (firefox)",
    225 : "altgr", 
    // 226 : "< /git >", 
    // 230 : "GNOME Compose Key", 
    // 233: "XF86Forward", 
    // 234: "XF86Back", 
    // 255 : "toggle touchpad" 
  };


  document.querySelector('body').addEventListener('keydown', function (e) {
    console.log('keycode: ', e.keyCode);
    console.log('code: ', e.code);

  });

  $scope.keys = {
    "a" : "undefined"
  };
  systemSettings.keys['70'] = '0';
});


