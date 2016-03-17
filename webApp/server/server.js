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
io.attach(server);
server.listen(3000, '127.0.0.1');

var path = require('path');

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
  console.log('new user connected')
  // set default quality
  socket.quality = 'high';
  CLIENTS[socket.id] = socket;
  // if it is the first client, make them the current streamer and set up listeners
  if (Object.keys(CLIENTS).length === 1) {
    currentStreamer = socket;
    currentStreamer.on('uploadFrame', function(photo) {
      photo = photo.slice('data:image/jpeg;base64,'.length)
      // make high quality
      sharp(new Buffer(photo, 'base64')).quality(80)
      .toBuffer()
      .then(function(buffer) {
        copiesOfCurrentFrame.high = {img:'data:image/jpeg;base64,' + buffer.toString('base64'), timeCreated: new Date().getTime()}
      })
      sharp(new Buffer(photo, 'base64')).quality(50)
      .toBuffer()
      .then(function(buffer) {
        copiesOfCurrentFrame.medium = {img:'data:image/jpeg;base64,' + buffer.toString('base64'), timeCreated: new Date().getTime()}
      })
      // make low quality
      sharp(new Buffer(photo, 'base64')).quality(20)
      .toBuffer()
      .then(function(buffer) {
        copiesOfCurrentFrame.low = {img:'data:image/jpeg;base64,' + buffer.toString('base64'), timeCreated: new Date().getTime()}
      })
      for (id in CLIENTS) {
        // serve up appropriate image quality for the client
        // console.log(copiesOfCurrentFrame[CLIENTS[id].quality])
        CLIENTS[id].emit('newFrame', copiesOfCurrentFrame[CLIENTS[id].quality]);
      }
    })
  }
  // listen for quality change
  socket.on('updateQuality', function(quality) {
    socket.quality = quality;
  })
  socket.on('disconnect', function(){
    console.log('a user disconnected')
    delete CLIENTS[socket.id]
  });
})





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
