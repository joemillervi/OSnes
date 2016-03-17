var express = require('express')
var app = express();
io = require('socket.io')();
const Imagemin = require('imagemin');
var sharp = require('sharp');


// var Jimp = require("jimp");
// var ss = require('socket.io-stream');
// var gulp = require('gulp');
// var imagemin = require('gulp-imagemin');
var server = require('http').Server(app);
server.listen(3000, '127.0.0.1');
io.listen(server,{
        log: false,
        origins: '*:*'
    });

var path = require('path');

io.set('transports', [
  'websocket', // 'disconnect' EVENT will work only with 'websocket'
  // 'xhr-polling',
  // 'jsonp-polling'
]);
function mapImageToDifferentRes(img) {
  new Imagemin()
  .src(img)
  .use(Imagemin.jpegtran({progressive: true}))
  return {low: null, medium: null, high: null};
}

var copiesOfCurrentFrame = {low: null, medium: null, high: null};
var currentStreamer = null;
var CLIENTS = {};
io.on('connection', function(socket) {
      socket.emit('becomeFirstStreamer')
  console.log('new user connected')
  CLIENTS[socket.id] = socket;
  // if it is the first client, make them the current streamer and set up listeners
  if (Object.keys(CLIENTS).length === 1) {
    currentStreamer = socket;
    socket.emit('becomeFirstStreamer')
  }
  // listen for quality change
  socket.on('updateQuality', function(quality) {
    socket.quality = quality;
  })
  socket.on('disconnect', function(){
    console.log('a user disconnected')
    delete CLIENTS[socket.id]
  });
  // CP
  var listOfBroadcasts = {};
  var getFirstAvailableBraodcater = function getFirstAvailableBraodcater(user) {
      var broadcasters = listOfBroadcasts[user.broadcastid].broadcasters;
      var firstResult;
      for (var userid in broadcasters) {
          if (broadcasters[userid].numberOfViewers <= 3) {
              firstResult = broadcasters[userid];
              continue;
          } else delete listOfBroadcasts[user.broadcastid].broadcasters[userid];
      }
      return firstResult;
  }

  var currentUser;
  socket.on('join-broadcast', function(user) {
      currentUser = user;

      user.numberOfViewers = 0;
      if (!listOfBroadcasts[user.broadcastid]) {
          listOfBroadcasts[user.broadcastid] = {
              broadcasters: {},
              allusers: {},
              typeOfStreams: user.typeOfStreams // object-booleans: audio, video, screen
          };
      }

      var firstAvailableBroadcaster = getFirstAvailableBraodcater(user);
      if (firstAvailableBroadcaster) {
          listOfBroadcasts[user.broadcastid].broadcasters[firstAvailableBroadcaster.userid].numberOfViewers++;
          socket.emit('join-broadcaster', firstAvailableBroadcaster, listOfBroadcasts[user.broadcastid].typeOfStreams);

          console.log('User <', user.userid, '> is trying to get stream from user <', firstAvailableBroadcaster.userid, '>');
      } else {
          currentUser.isInitiator = true;
          socket.emit('start-broadcasting', listOfBroadcasts[user.broadcastid].typeOfStreams);

          console.log('User <', user.userid, '> will be next to serve broadcast.');
      }

      listOfBroadcasts[user.broadcastid].broadcasters[user.userid] = user;
      listOfBroadcasts[user.broadcastid].allusers[user.userid] = user;
  });

  socket.on('message', function(message) {
      socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', function() {
      if (!currentUser) return;
      if (!listOfBroadcasts[currentUser.broadcastid]) return;
      if (!listOfBroadcasts[currentUser.broadcastid].broadcasters[currentUser.userid]) return;

      delete listOfBroadcasts[currentUser.broadcastid].broadcasters[currentUser.userid];
      if (currentUser.isInitiator) {
          delete listOfBroadcasts[currentUser.broadcastid];
      }
  });
});







setInterval(function() {
  console.log('total clients', Object.keys(CLIENTS).length)
  if (currentStreamer) console.log('current streamer', currentStreamer.id)
  // if (currentStreamer) {
  //   currentStreamer.emit('deSelectClient')
  //   console.log('unselect', currentStreamer.id)
  // var keys = Object.keys(CLIENTS)
  // var currentStreamer = CLIENTS[keys[Math.floor(Math.random() * keys.length)]];
  // console.log('selected new streamer', currentStreamer.id)
  // currentStreamer.emit('chosenClient');
  // }
}, 3000)
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
