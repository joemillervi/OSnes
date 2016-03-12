var url = require('url');
var numberOfPlayersJoined = 0;
var controllerAction

function router(req, res) {

  var httpVerb = req.method;
  var httpPath = req.url;
  // console.log('httpPath');
  // console.log(httpPath);
  var pathArr = req.url.split('/');
  // console.log('pathArr:');
  // console.log(pathArr);
  var query = url.parse(req.url, true).query;

  if (
    httpVerb === 'GET' &&
    httpPath === '/pair-controller'
    // pathArr[1] === 'pair-controller' &&
    // pathArr[2] === undefined
  ) { // app.get('/pair-controller', cb)
    res.writeHead(200, {'Content-Type': 'application/json'});
    if (numberOfPlayersJoined === 0) {
      console.log('player 1 just joined');
      numberOfPlayersJoined++;
      res.end(JSON.stringify({player: 'p1'}));
    } else if (numberOfPlayersJoined === 1) {
      console.log('player 2 just joined');
      numberOfPlayersJoined++
      res.end(JSON.stringify({player: 'p2'}));
    } else {
      console.log('no more players allowed');
      res.end(JSON.stringify({player: 'no more players allowed'}));
    }
  } else if ( // app.get('/player/:player-num/press/:button', cb)
    httpVerb === 'GET' &&
    pathArr[1] === 'player' &&
    pathArr[3] === 'press' &&
    pathArr[5] === undefined
  ) {
    var playerNum = parseInt(pathArr[2]);
    var button = pathArr[4];
    // controllerAction = $.Event('keydown');
    controllerAction = new KeyboardEvent('keydown'); // {code: 'KeyD'}
    // controllerAction.which = 13;
    // delete controllerAction.which;
    mapKey(playerNum, button, controllerAction);
    // $('body').trigger(controllerAction);
    var snes9x = document.getElementById('snes9x');
    snes9x.focus();
    snes9x.dispatchEvent(controllerAction);
    // document.querySelector('body').dispatchEvent(controllerAction);
    console.log('player ' + playerNum + ' just pressed "' + button + '"');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'Player ' + playerNum + ' just pressed ' + button}));
  } else if ( // app.get('/player/:player-num/release/:button', cb)
    httpVerb === 'GET' &&
    pathArr[1] === 'player' &&
    pathArr[3] === 'release' &&
    pathArr[5] === undefined
  ) {
    var playerNum = pathArr[2];
    var button = pathArr[4];
    console.log('player ' + playerNum + ' just released "' + button + '"');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'Player ' + playerNum + ' just released ' + button}));
  } else {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end();
  }
};

function mapKey(playerNum, button, controllerAction) {
  console.log('in mapKey');
  console.log('typeof playerNum');
  console.log(typeof playerNum);
  console.log('button:', button);
  console.log('controllerAction:');
  console.log(controllerAction);
  if (playerNum === 1) {
    console.log('in playernum 1');
    switch (button) {
      case 'a':
        setEventProps(controllerAction, 68);
        break;
      case 'b':
        setEventProps(controllerAction, 67);
        break;
      case 'x':
        setEventProps(controllerAction, 83);
        break;
      case 'y':
        setEventProps(controllerAction, 88);
        break;
      case 'start':
        setEventProps(controllerAction, 13);
        break;
      case 'select':
        setEventProps(controllerAction, 32);
        break;
      case 'up':
        setEventProps(controllerAction, 38);
        break;
      case 'down':
        setEventProps(controllerAction, 40);
        break;
      case 'left':
        setEventProps(controllerAction, 37);
        break;
      case 'right':
        setEventProps(controllerAction, 39);
        break;
      case 'l-shoulder':
        setEventProps(controllerAction, 65);
        break;
      case 'r-shoulder':
        setEventProps(controllerAction, 90);
        break;
      default:
        console.log('DEFAULT case');
        break;
    }
  } else {
    switch (button) {
      case 'a':
        controllerAction.which = 'PgUp';
        break;
      case 'b':
        controllerAction.which = 'PgDn';
        break;
      case 'x':
        controllerAction.which = 'Home';
        break;
      case 'y':
        controllerAction.which = 'End';
        break;
      case 'start':
        controllerAction.which = 'KP Enter?';
        break;
      case 'select':
        controllerAction.which = 'KP Add';
        break;
      case 'up':
        controllerAction.which = 'KP 8';
        break;
      case 'down':
        controllerAction.which = 'KP 2';
        break;
      case 'left':
        controllerAction.which = 'KP 4';
        break;
      case 'right':
        controllerAction.which = 'KP 6';
        break;
      case 'l-shoulder':
        controllerAction.which = 'Ins';
        break;
      case 'r-shoulder':
        controllerAction.which = 'Del';
        break;
      default:
        break;
    }
  }
}

function setEventProps(controllerAction, asciiNum) {
  delete controllerAction.isTrusted;
  Object.defineProperty(controllerAction, 'isTrusted', {'value': asciiNum});
  Object.defineProperty(controllerAction, 'which', {'value': asciiNum});
  Object.defineProperty(controllerAction, 'keyCode', {'value': asciiNum});
  Object.defineProperty(controllerAction, 'key', {'value': asciiNum});
  Object.defineProperty(controllerAction, 'charCode', {'value': 0});
  Object.defineProperty(controllerAction, 'view', {'value': window});
  Object.defineProperty(controllerAction, 'bubbles', {'value': true});
  Object.defineProperty(controllerAction, 'altKey', {'value': true});
  Object.defineProperty(controllerAction, 'cancelable', {'value': true});
  Object.defineProperty(controllerAction, 'repeat', {'value': false});
  Object.defineProperty(controllerAction, 'shiftKey', {'value': false});
  Object.defineProperty(controllerAction, 'keyLocation', {'value': 0});
  Object.defineProperty(controllerAction, 'keyIdentifier', {'value': 'Down'});
  Object.defineProperty(controllerAction, 'metaKey', {'value': false});
  Object.defineProperty(controllerAction, 'ctrlKey', {'value': false});
  Object.defineProperty(controllerAction, 'detail', {'value': 0});
  Object.defineProperty(controllerAction, 'code', {'value': 'ArrowDown'});
}

try {
  module.exports = router;
} catch (err) {}

// var evt = document.createEvent('Event');
// evt.initEvent('keydown', true, true, window, 0, 0, 0, 0, 0, 38);
// var evt = new CustomEvent('keydown');
// setEventProps(evt, 40);

var body = document.querySelector('body');
var snes9x = document.getElementById('snes9x');

body.addEventListener('keydown', function (e) {
  console.log('da event triggurd: ', e);
});

var evt = new KeyboardEvent('keydown', {
  'bubbles': true,
  'keyCode': 40,
  'charCode': 0,
  'key': 'ArrowDown',
  'view': window
});

Object.defineProperty(evt, 'keyCode', {value: 40, enumerable: true});
Object.defineProperty(evt, 'charCode', {value: 0, enumerable: true});
Object.defineProperty(evt, 'which', {value: 40, enumerable: true});
Object.defineProperty(evt, 'view', {value: window, enumerable: true});
Object.defineProperty(evt, 'code', {value: 'ArrowDown', enumerable: true});
Object.defineProperty(evt, 'keyIdentifier', {value: 'Down', enumerable: true});

setInterval(function () {
  snes9x.dispatchEvent(evt);
}, 3000);
