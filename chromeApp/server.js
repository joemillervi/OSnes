onload = function() {

  chrome.system.network.getNetworkInterfaces(function (nets) {
    ipAddresses = nets;
    document.getElementById('ip').innerText = nets[0].address;
    console.log(nets)
  });

  var http = require('http');
  var url = require('url');
  var port = 1339;
  var host = '0.0.0.0';

  http.createServer(function (req, res) {

    var httpVerb = req.method;
    var pathArr = req.url.split('/');
    var query = url.parse(req.url, true).query;

    if ( // app.get('/p1/:button', cb)
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
      res.end({error: 'Content not found'});
    }
  }).listen(port, host);
  console.log('Server running at ' + host + ':' + port + '/');

};
