

module.exports = exports = WebRTC_Scalable_Broadcast;

var currentStreamerSocket;
// generate random first broadcast ID
function WebRTC_Scalable_Broadcast(app) {

  var io = require('socket.io').listen(app);

  var CLIENTS = {};
  io.on('connection', function(socket) {
  console.log('new user connected')
  CLIENTS[socket.id] = socket;
    if (Object.keys(CLIENTS).length === 1) {
      console.log('first streamer')
      socket.emit('become-streamer', Object.keys(CLIENTS))
      currentStreamerSocket = socket;
    } else {
      console.log('server: new peer')
      currentStreamerSocket.emit('new-peer', socket.id)
    }
    // route new peer connection to peer that requested it
    socket.on('connect-to-peer', function(data) {
      console.log(data)
      CLIENTS[data.id].emit('connect-to-streamers-peer', data)
    });

    socket.on('signal-peer1', function(data) {
      currentStreamerSocket.emit('signal-peer2', data);
    })

    socket.on('disconnect', function() {
      console.log('a user disconnected')
      delete CLIENTS[socket.id]
    })
  })

  // every couple seconds reset who is streaming
  setInterval(function() {
    console.log(Object.keys(CLIENTS))
    // currentStreamerSocket.emit('stop-streaming')
    // currentStreamerSocket = CLIENTS[Object.keys(CLIENTS)[Math.floor(Math.random() * Object.keys(CLIENTS).length)]];
    // currentStreamerSocket.emit('become-streamer', allSDP)
    // for (id in CLIENTS) {
    //   CLIENTS[id].emit('listen-from-streamer', currentStreamerSocket.SDP)
    // }
  }, 4000)
}
