// Muaz Khan   - www.MuazKhan.com
// MIT License - www.WebRTC-Experiment.com/licence
// Source Code - https://github.com/muaz-khan/WebRTC-Scalable-Broadcast

var fs = require("fs");
var path = require('path');
var express = require('express');
var app = express();

app.get('/', function(req,res) {
  res.sendfile('./index.html');
});
app.use(express.static('./'));

// for ssl server
var https = require('https');
var privateKey  = fs.readFileSync(path.resolve(__dirname+'/../sslcerts/mydomain.key'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname+'/../sslcerts/2_www.osnes.website.crt'), 'utf8');
var ca = [
            fs.readFileSync(path.resolve(__dirname+'/../sslcerts/1_Intermediate.crt'), 'utf8'),
            fs.readFileSync(path.resolve(__dirname+'/../sslcerts/root.crt'), 'utf8')
        ]
var credentials = {key: privateKey, cert: certificate, ca: ca};

var server = app.listen(80, '0.0.0.0', function(req, res) {
  console.log("Server listening at 80");
});

// start https server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);
console.info('==> 🌎 HTTPS running on port %s.', 443);
console.log('https server address: ' + JSON.stringify(httpsServer.address()));

require('./WebRTC-Scalable-Broadcast.js')(httpsServer);
