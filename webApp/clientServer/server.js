require('./../env.js');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var redis = require('./redis')();
var config = require('../webpack.config.js');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleWare = require('webpack-hot-middleware');
var https = require('https');
console.log(process.env.NODE_ENV)
process.title = 'crowdmu-web';

if (process.env.NODE_ENV === 'production') {
  // for ssl server
  var fs = require('fs');
  var https = require('https');
  var privateKey  = fs.readFileSync(path.resolve(__dirname+'/../sslcerts/mydomain.key'), 'utf8');
  var certificate = fs.readFileSync(path.resolve(__dirname+'/../sslcerts/2_www.osnes.website.crt'), 'utf8');
  var ca = [
              fs.readFileSync(path.resolve(__dirname+'/../sslcerts/1_Intermediate.crt'), 'utf8'),
              fs.readFileSync(path.resolve(__dirname+'/../sslcerts/root.crt'), 'utf8')
          ]
  var credentials = {key: privateKey, cert: certificate, ca: ca};
}

var port = process.env.NODE_ENV === 'production' ? 80 : 3000;
var httpsPort = process.env.HTTPS_PORT || 443;

if (process.env.NODE_ENV !== 'production') {
  var compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath})); // get rid of this middleware for production
  app.use(webpackHotMiddleWare(compiler));
}

app.use(bodyParser.json());
app.use(express.static('./../dist'));


var url = process.env.CROWDMU_IO_URL || 'http://localhost:3001';

// Serves index.ejs with socket.io URL included as a variable
app.set('view engine', 'ejs');
app.get('/', function(req, res, next){
  res.render(path.resolve(__dirname + './../client/index'), {
    ioURL: url
  });
});

// Serves a still screenshot of the emulator. Useful for testing connection
app.get('/screenshot.png', function(req, res, next) {
  redis.get('crowdmu:frame', function(err, image){
    if (err) return next(err);
    res.writeHead(200, {
      'Content-Type':'image/png',
      'Content-Length': image.length});
    res.end(image);
  });
});

// start listening to requests
app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log('Server listening on port ', port);
});

if (process.env.NODE_ENV = 'production') {
  // start https server
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(httpsPort);
  console.info('https running on port %s.', httpsPort);
}

// require the socket.io server and start it passing our https server
require(__dirname + '/../ioNode/index.js')(httpsServer)
// export our app for testing
module.exports = app;
