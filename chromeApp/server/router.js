var url = require('url');
var numberOfPlayersJoined = 0;

function router(req, res) {

  var httpVerb = req.method;
  var httpPath = req.url;
  console.log('httpPath');
  console.log(httpPath);
  var pathArr = req.url.split('/');
  var query = url.parse(req.url, true).query;

  // var routes = {
  //   'GET': {
  //     '/pair-controller': function (req, res) {
  //
  //     }
  //   },
  //   'POST': {
  //
  //   }
  // }
  // routes[httpPath][httpPath](req, res);


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
  } else if ( // app.get('/p1/:button', cb)
    httpVerb === 'GET' &&
    pathArr[1] === 'p1' &&
    pathArr[3] === undefined
  ) {
    var button = pathArr[2];
    console.log('player 1 just pressed "' + button + '"');
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'Player 1 just pressed ' + button}));
  } else {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end();
  }
};

try {
  module.exports = router;
} catch (err) {}
