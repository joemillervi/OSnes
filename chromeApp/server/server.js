// onload = function() {

  var ipv4;
  var http = require('http');
  var url = require('url');
  var port = 1337;
  var host = '0.0.0.0';
  try {
    if (!router) {
      var router = require('./router.js');
    }
  } catch (err) {}

  try { // try/catch block here for testing in a real Node environment. Node doesn't know what 'chrome is'.
    chrome.system.network.getNetworkInterfaces(function (ipAddresses) {
      ipAddresses.forEach(function (ipAddress) {
        if (ipAddress.prefixLength === 12) {
          console.log('triggered');
          ipv4 = ipAddress.address;
        }
      });
      document.getElementById('ip').innerText = ipv4;
      var toQ = ipv4 + ':' + port + '/pair-controller';
      console.log('toQ');
      console.log(toQ);
      new QRCode(document.getElementById('qrcode'), toQ);
    });
  } catch(err) {
    console.error('err: ', err);
  }

  http.createServer(function (req, res) {

    router(req, res);

  }).listen(port, host);
  console.log('Server running at ' + host + ':' + port + '/');

// };
