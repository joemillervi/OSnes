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

// generate random first broadcast ID
var currentBroadCastID = String(Math.floor(Math.random() * 10000))
function WebRTC_Scalable_Broadcast(app) {
    var io = require('socket.io').listen(app, {
        log: false,
        origins: '*:*'
    });

    io.set('transports', [
        'websocket', // 'disconnect' EVENT will work only with 'websocket'
        'xhr-polling',
        'jsonp-polling'
    ]);
    var currentStreamerSocket; // current streamer
    var listOfBroadcasts = {};

    var CLIENTS = {};
    io.on('connection', function(socket) {
      console.log('new user connected')
      CLIENTS[socket.id] = socket;

      socket.emit('open-or-join', currentBroadCastID)
      var currentUser;
      socket.on('join-broadcast', function(user) {
          currentUser = user;
          socket.user = user; // save data about this user in the network to the socket
          console.log(user)

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
            currentStreamerSocket = socket;
            socket.emit('start-broadcasting', listOfBroadcasts[user.broadcastid].typeOfStreams);

            console.log('User <', user.userid, '> will be next to serve broadcast.');
          }

          // store a reference to the user on the socket object and keep a list of all users
          listOfBroadcasts[user.broadcastid].broadcasters[user.userid] = user;
          listOfBroadcasts[user.broadcastid].allusers[user.userid] = user;
        });

        socket.on('message', function(message) {
            socket.broadcast.emit('message', message);
        });

        socket.on('disconnect', function() {
            console.log('a user disconnected')
            delete CLIENTS[socket.id]
            if (!currentUser) return;
            if (!listOfBroadcasts[currentUser.broadcastid]) return;
            if (!listOfBroadcasts[currentUser.broadcastid].broadcasters[currentUser.userid]) return;

            delete listOfBroadcasts[currentUser.broadcastid].broadcasters[currentUser.userid];
            if (currentUser.isInitiator) {
                delete listOfBroadcasts[currentUser.broadcastid];
            }
        });
    });

    function getFirstAvailableBraodcater(user) {
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

    // Tell a random sockett to be the next broadcaster
    // tell everyone else to listen to them
    setInterval(function() {
      console.log('total clients', Object.keys(CLIENTS).length)
      if (currentStreamerSocket.user.userid) console.log('Current broadcaster userid', currentStreamerSocket.user.userid || 'NONE')
      currentStreamerSocket = CLIENTS[Object.keys(CLIENTS)[Math.floor(Math.random() * Object.keys(CLIENTS).length)]];
      currentBroadCastID = String(Math.floor(Math.random() * 10000)); // update current broadcast ID

      if (currentStreamerSocket) {
        currentStreamerSocket.emit('start-broadcasting', {
            video: true,
            screen: false,
            audio: false,
            oneway: true
        });
        // store new broadcast id along with that user
        currentStreamerSocket.user.broadcastid = currentBroadCastID = String(Math.floor(Math.random() * 10000))
      }
    }, 10000)}
