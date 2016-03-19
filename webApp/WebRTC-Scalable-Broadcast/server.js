// Muaz Khan   - www.MuazKhan.com
// MIT License - www.WebRTC-Experiment.com/licence
// Source Code - https://github.com/muaz-khan/WebRTC-Scalable-Broadcast

var fs = require("fs");
var path = require('path');

var app = require('http').createServer(function (request, response) {
    var uri = require('url').parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    var isWin = !!process.platform.match(/^win/);

    if (fs.statSync(filename).isDirectory()) {
        if(!isWin) filename += '/index.html';
        else filename += '\\index.html';
    }

    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });
            response.write('404 Not Found: ' + filename + '\n');
            response.end();
            return;
        }

        fs.readFile(filename, 'binary', function (err, file) {
            if (err) {
                response.writeHead(500, {
                    "Content-Type": "text/plain"
                });
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, 'binary');
            response.end();
        });
    });
});

var port = isDeveloping ? 8080 : process.env.PORT || 80;
var httpsPort = isDeveloping ? 8443 : process.env.HTTPS_PORT || 443;
// for ssl server
var https = require('https');
var privateKey  = fs.readFileSync(path.resolve(__dirname+'/../sslcerts/mydomain.key'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname+'/../sslcerts/mydomain.crt'), 'utf8');
var ca = [
            fs.readFileSync(path.resolve(__dirname+'/../sslcerts/intermediate.crt'), 'utf8'),
            fs.readFileSync(path.resolve(__dirname+'/../sslcerts/root.crt'), 'utf8')
        ]
var credentials = {key: privateKey, cert: certificate, ca: ca};

var server = app.listen(80, '0.0.0.0', function() {
  var addr = app.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});

// start https server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(443);
console.info('==> 🌎 HTTPS running on port %s.', 443);
console.log('https server address: ' + JSON.stringify(httpsServer.address()));

require('./WebRTC-Scalable-Broadcast.js')(server);
