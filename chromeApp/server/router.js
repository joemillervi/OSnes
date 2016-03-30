var url = require('url');
var numberOfPlayersJoined = 0;
var controllerAction;

function router(req, res) {

  var httpVerb = req.method;
  var httpPath = req.url;
  var pathArr = req.url.split('/');

  if ( // app.get('/pair-controller', cb)
    httpVerb === 'GET' &&
    httpPath === '/pair-controller'
  ) {

    window.toggleInputSelectionScreen();

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    if (numberOfPlayersJoined === 0) {
      numberOfPlayersJoined++;
      res.end(JSON.stringify({ipAddress: ip4, port: port}));
    } else {
      res.end(JSON.stringify({message: 'no more players allowed'}));
    }
  } else if ( // app.post('/player/:action/:button', cb)   like: /player/press/a
    httpVerb === 'POST' && //Post requests are possible and don't fire three times
    pathArr.length === 4 &&
    pathArr[1] === 'player'
  ) {
    var action;
    if (pathArr[2] === 'press') {
      action = 'keydown';
    } else if (pathArr[2] === 'release') {
      action = 'keyup';
    }
    var button = pathArr[3];
    var asciiNum = getAsciiKey(button);
    var keyBoardEvent = makeEvent(action, asciiNum);
    document.querySelector('body').dispatchEvent(keyBoardEvent);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'player just ' + action + 'ed ' + button}));
  } else {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end();
  }
};

function getAsciiKey(button) {
  switch (button) {
    case 'a':
      return 74;
    case 'b':
      return 75;
    case 'x':
      return 76;
    case 'y':
      return 186
    case 'start':
      return 13;
    case 'select':
      return 16; //select is shift
    case 'up':
      return 38;
    case 'down':
      return 40;
    case 'left':
      return 37;
    case 'right':
      return 39;
    case 'l-shoulder':
      return 69;
    case 'r-shoulder':
      return 39;
    default:
      break;
  }
}

try {
  module.exports = router;
} catch (err) {}

// Helper function to create keyboard events:
function makeEvent(type, asciiNum) {

  var evt = new KeyboardEvent(type, {
    'bubbles': true,
    'keyCode': asciiNum,
    'charCode': 0,
    // 'key': 'ArrowDown',
    'view': window
  });

  Object.defineProperty(evt, 'keyCode', {value: asciiNum, enumerable: true});
  Object.defineProperty(evt, 'charCode', {value: 0, enumerable: true});
  Object.defineProperty(evt, 'which', {value: asciiNum, enumerable: true});
  Object.defineProperty(evt, 'view', {value: window, enumerable: true});
  return evt;

}
