// Muaz Khan   - www.MuazKhan.com
// MIT License - www.WebRTC-Experiment.com/licence

// WebRTC Scalable Broadcast:
// this module simply initializes socket.io
// and configures it in a way that
// single broadcast can be relayed over unlimited users
// without any bandwidth/CPU usage issues.
// Everything happens peer-to-peer!

// Ref. discussion: https://github.com/muaz-khan/WebRTC-Experiment/issues/2
// Source Code: https://github.com/muaz-khan/WebRTC-Scalable-Broadcast

module.exports = exports = WebRTC_Scalable_Broadcast;
var currentBroadCastID = String(Math.floor(Math.random() * 10000))

var currentStreamerSocket;
// generate random first broadcast ID
function WebRTC_Scalable_Broadcast(app) {

  var io = require('socket.io').listen(app);

  var allSDP = [];
  var CLIENTS = {};
  io.on('connection', function(socket) {
    console.log('new user connected')
    CLIENTS[socket.id] = socket;

    if (CLIENTS.length === 1) {
      socket.emit('become-first-streamer')
    } else {
      // get all peers to init a connection with the new peer
      for (var id in CLIENTS) {
        CLIENTS[id].emit('new-peer', socket.id)
      }
    }
    // route new peer connection to peer that requested it
    socket.on('connect-to-peer', function(data) {
      CLIENTS[data.id].emit('got-requested-SDP', data)
    });




    socket.on('disconnect', function() {
      console.log('a user disconnected')
      delete CLIENTS[socket.id]
    })
  })

  // every couple seconds reset who is streaming
  setInterval(function() {
    currentStreamerSocket.emit('stop-streaming')
    currentStreamerSocket = CLIENTS[Object.keys(CLIENTS)[Math.floor(Math.random() * Object.keys(CLIENTS).length)]];
    currentStreamerSocket.emit('become-streamer', allSDP)
    for (id in CLIENTS) {
      CLIENTS[id].emit('listen-from-streamer', currentStreamerSocket.SDP)
    }
  }, 4000)
}
    // var io = require('socket.io').listen(app, {
    //     log: false,
    //     origins: '*:*'
    // });
    //
    // io.set('transports', [
    //     'websocket', // 'disconnect' EVENT will work only with 'websocket'
    //     'xhr-polling',
    //     'jsonp-polling'
    // ]);
    // var currentStreamerSocket; // current streamer
    // var listOfBroadcasts = {};
    // var currentUser;
    //
    // var CLIENTS = {};
    // io.on('connection', function(socket) {
    //   console.log('new user connected, currentbraodcastID is:', currentBroadCastID)
    //   CLIENTS[socket.id] = socket;
    //
    //   socket.emit('open-or-join', currentBroadCastID)
    //
    //   socket.on('join-broadcast', function(user) {
    //       currentUser = user;
    //       socket.user = user; // save data about this user in the network to the socket
    //       console.log(user)
    //       user.numberOfViewers = 0;
    //       if (!listOfBroadcasts[user.broadcastid]) {
    //           listOfBroadcasts[user.broadcastid] = {
    //               broadcasters: {},
    //               allusers: {},
    //               typeOfStreams: user.typeOfStreams // object-booleans: audio, video, screen
    //           };
    //       }
    //
    //       var firstAvailableBroadcaster = getFirstAvailableBraodcater(user);
    //       if (firstAvailableBroadcaster) {
    //         console.log('found broadcaster!!', firstAvailableBroadcaster)
    //         listOfBroadcasts[user.broadcastid].broadcasters[firstAvailableBroadcaster.userid].numberOfViewers++;
    //         socket.emit('join-broadcaster', firstAvailableBroadcaster, listOfBroadcasts[user.broadcastid].typeOfStreams);
    //         console.log('found broadcaster')
    //         console.log('User <', user.userid, '> is trying to get stream from user <', firstAvailableBroadcaster.userid, '>');
    //       } else {
    //         console.log('did not find broadcaster')
    //         currentUser.isInitiator = true;
    //         currentStreamerSocket = socket;
    //         socket.emit('start-broadcasting', listOfBroadcasts[user.broadcastid].typeOfStreams);
    //
    //         console.log('User <', user.userid, '> is now broadcasting ');
    //       }
    //
    //       // store a reference to the user on the socket object and keep a list of all users
    //       listOfBroadcasts[user.broadcastid].broadcasters[user.userid] = user;
    //       listOfBroadcasts[user.broadcastid].allusers[user.userid] = user;
    //     });
    //
    //     socket.on('message', function(message) {
    //         socket.broadcast.emit('message', message);
    //     });
    //
        // socket.on('disconnect', function() {
        //     console.log('a user disconnected')
        //     delete CLIENTS[socket.id]
    //         if (!currentUser) return;
    //         if (!listOfBroadcasts[currentUser.broadcastid]) return;
    //         if (!listOfBroadcasts[currentUser.broadcastid].broadcasters[currentUser.userid]) return;
    //
    //         delete listOfBroadcasts[currentUser.broadcastid].broadcasters[currentUser.userid];
    //         if (currentUser.isInitiator) {
    //             delete listOfBroadcasts[currentUser.broadcastid];
    //         }
    //     });
    // });
    //
    // function getFirstAvailableBraodcater(user) {
    //     var broadcasters = listOfBroadcasts[user.broadcastid].broadcasters;
    //     var firstResult;
    //     for (var userid in broadcasters) {
    //         if (broadcasters[userid].numberOfViewers <= 3) {
    //             firstResult = broadcasters[userid];
    //             continue;
    //         } else delete listOfBroadcasts[user.broadcastid].broadcasters[userid];
    //     }
    //     return firstResult;
    // }
    //
    // var typeOfStreams = {
    //     video: true,
    //     screen: false,
    //     audio: false,
    //     oneway: true
    // }
    //
    // // Tell a random sockett to be the next broadcaster
    // // tell everyone else to listen to them
    // setInterval(function() {
    //   if (currentStreamerSocket) {
    //     currentStreamerSocket = CLIENTS[Object.keys(CLIENTS)[Math.floor(Math.random() * Object.keys(CLIENTS).length)]];
    //     // update current broadcast ID ??
    //     currentStreamerSocket.user.broadcastid = currentBroadCastID = String(Math.floor(Math.random() * 100000));
    //     console.log('==================')
    //     console.log('total clients', Object.keys(CLIENTS).length, 'switching to new streamer with userid:', currentStreamerSocket.user.userid)
    //     console.log('current broadcast id:', currentBroadCastID)
    //     console.log('current broadcaster', currentStreamerSocket.user)
    //     currentUser.isInitiator = true;
    //     currentStreamerSocket.user.numberOfViewers = 0;
    //     if (!listOfBroadcasts[currentStreamerSocket.user.broadcastid]) {
    //         listOfBroadcasts[currentStreamerSocket.user.broadcastid] = {
    //             broadcasters: {},
    //             allusers: {},
    //             typeOfStreams: currentStreamerSocket.user.typeOfStreams // object-booleans: audio, video, screen
    //         };
    //     }
    //     listOfBroadcasts[currentStreamerSocket.user.broadcastid].broadcasters[currentStreamerSocket.user.userid] = currentStreamerSocket.user;
    //     listOfBroadcasts[currentStreamerSocket.user.broadcastid].allusers[currentStreamerSocket.user.userid] = currentStreamerSocket.user;
    //     console.log('list of broadcasts:', listOfBroadcasts)
    //     currentStreamerSocket.emit('start-broadcasting', typeOfStreams);
    //     // Reset connections between all sockets around new current broadcaster
    //     for (socketid in CLIENTS) {
    //       if (socketid === currentStreamerSocket.id) continue;
    //       var firstAvailableBroadcaster = getFirstAvailableBraodcater(currentStreamerSocket.user);
    //       if (firstAvailableBroadcaster) {
    //         listOfBroadcasts[currentStreamerSocket.user.broadcastid].broadcasters[firstAvailableBroadcaster.userid].numberOfViewers++;
    //         // add this user as a broadcaster of this broadcast
    //         listOfBroadcasts[currentStreamerSocket.user.broadcastid].broadcasters[CLIENTS[socketid].user.userid] = CLIENTS[socketid].user;
    //         listOfBroadcasts[currentStreamerSocket.user.broadcastid].allusers[CLIENTS[socketid].user.userid] = CLIENTS[socketid].user;
    //         CLIENTS[socketid].emit('join-broadcaster', firstAvailableBroadcaster, typeOfStreams)
    //       }
    //     }
    //   }
    //   else console.log('current streamer socket undefined', currentStreamerSocket)
    // }, 15000)}
