var express = require('express')
var app = express();
io = require('socket.io')();

var server = require('http').Server(app);
io.attach(server);
server.listen(3000);


// var ss = require('socket.io-stream');

var path = require('path');

var CLIENTS = [];
io.on('connection', function(socket) {
  console.log('a client connected')
  socket.on('disconnect', function(){
    console.log('client disconnected');
});
})

app.use(express.static('./../'))

//
// io.of('/user').on('connection', function(socket) {
//   ss(socket).on('profile-image', function(stream, data) {
//     var filename = path.basename(data.name);
//     stream.pipe(fs.createWriteStream(STANDARD OUT));
//   });
// });


// export our app for testing
module.exports = app;
