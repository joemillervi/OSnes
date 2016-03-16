var express = require('express')
var app = express();
io = require('socket.io')();
// var ss = require('socket.io-stream');

var server = require('http').Server(app);
io.attach(server);
server.listen(3000, '0.0.0.0');

var path = require('path');

var currentStreamerid;
var CLIENTS = {};
io.on('connection', function(socket) {
  console.log(socket.id)
  CLIENTS[socket.id] = socket;
  socket.on('uploadPhoto', function(data) {
    for (id in CLIENTS) {
      CLIENTS[id].emit('newFrame', data);
    }
  })
  socket.on('disconnect', function(){
    console.log('client disconnected')
    delete CLIENTS[socket.id]
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
