onload = function() {

  var http = require('http');
  var url = require('url');
  var port = 1337;
  var host = '127.0.0.1';

  http.createServer(function (req, res) {

    var httpVerb = req.method;
    var pathArr = req.url.split('/');
    var query = url.parse(req.url, true).query;

    if (
      httpVerb === 'GET' &&
      pathArr[1] === 'p1' &&
      pathArr[3] === undefined
    ) { //  app.get('/p1/:button', cb)
      var button = pathArr[2];
      console.log('player 1 just pressed "' + button + '"');
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({message: 'Player 1 just pressed ' + button}));
    } else {
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end({error: 'Content not found'});
    }
  }).listen(port, host);
  console.log('Server running at ' + host + ':' + port + '/');

};
