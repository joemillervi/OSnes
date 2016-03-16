var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var config = require('../webpack.config.js');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleWare = require('webpack-hot-middleware');

var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath})); // get rid of this middleware for production
app.use(webpackHotMiddleWare(compiler));

app.use(express.static('./dist'));

app.use(bodyParser.json());
// app.use(express.static(__dirname + '/../client')); // react index.html

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/', function (req, res) {
  res.sendFile(path.resolve('client/index.html'));
});

app.route('/test')
  .get(function(req, res){
    res.send('Hello World');
});


var port = process.env.PORT || 3000;

// start listening to requests on port 3000
app.listen(port, function (err) {
  if (err) {
    throw err;
  }
  console.log('Server listening on port ', port);
});

// export our app for testing
module.exports = app;
