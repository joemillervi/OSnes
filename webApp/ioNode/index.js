module.exports = socketServer;
function socketServer(app){
var sio = require('socket.io');
var forwarded = require('forwarded-for');
var debug = require('debug');
var redis = require('./redis')();

process.title = 'crowdmu-io';

var port = process.env.CROWDMU_PORT || 3001;
var io = module.exports = sio.listen(app);
console.log('listening on *:' + port);

var throttle = process.env.CROWDMU_IP_THROTTLE || 100;

// redis socket.io adapter
var uri = process.env.CROWDMU_REDIS || 'localhost:6379';
io.adapter(require('socket.io-redis')(uri));

// redis queries instance
var redis = require('./redis')();

var keys = {
  right: 0,
  left: 1,
  up: 2,
  down: 3,
  a: 4,
  b: 5,
  select: 6,
  start: 7
};

var uid = process.env.CROWDMU_SERVER_UID || port;
debug('server uid %s', uid);

// initialize array of user-selected moves and vote count object:
var moves = [];
var voteCount = {};
var CLIENTS = {};
// helper function to find the winning vote:
var mode = function (arr) {
  var counts = {};
  arr.forEach(function (elt) {
    counts[elt] = (counts[elt]) ? (counts[elt] + 1) : 1;
  });
  var highWaterMark = 0;
  var mostCommon;
  for (var key in counts) {
    if (counts[key] > highWaterMark) {
      highWaterMark = counts[key];
      mostCommon = key;
    }
  }
  return mostCommon;
};

io.total = 0;
var currentStreamerSocket;
io.on('connection', function(socket){
  // send them the most recent frame of the emulator
  redis.get('crowdmu:frame', function(err, image) {
    if (err) console.log(err)
    else socket.emit('frame', image)
  });
  console.log('a client connected');
  // Do we need to do this or can we rely on io.sockets to be an array of all sockets?
  CLIENTS[socket.id] = socket;

  if (Object.keys(CLIENTS).length === 1) {
    console.log('first streamer')
    socket.emit('become-streamer', {allIDs: Object.keys(CLIENTS), myID: socket.id})
    currentStreamerSocket = socket;
  } else {
    console.log('server: new peer')
    currentStreamerSocket.emit('new-peer', socket.id)
  }
  // route new peer connection to peer that requested it
  socket.on('connect-to-peer', function(data) {
    console.log('connect-to-peer')
    CLIENTS[data.id].emit('connect-to-streamers-peer', data)
  });

  socket.on('signal-peer1', function(data) {
    currentStreamerSocket.emit('signal-peer2', data);
  })

  socket.on('disconnect', function() {
    console.log('a user disconnected')
    delete CLIENTS[socket.id]
  })

  var req = socket.request;
  var ip = forwarded(req, req.headers);
  debug('client ip %s', ip);

  // keep track of connected clients
  updateCount(++io.total);
  socket.on('disconnect', function(){
    updateCount(--io.total);
  });

  // send events log so far
  redis.lrange('crowdmu:log', 0, 20, function(err, log){
    if (!Array.isArray(log)) return;
    log.reverse().forEach(function(data){
      data = data.toString();
      socket.emit.apply(socket, JSON.parse(data));
    });
  });

  // populate the moves array when users cast their move vote:
  socket.on('submitMove', function (key, timestamp) {
    if (socket.hasVoted) {
      return;
    }
    moves.push(key);
    voteCount[key] = (voteCount[key]) ? (voteCount[key] + 1) : 1;
    io.sockets.emit('sendVoteCount', voteCount);
    socket.hasVoted = true;

    // broadcast all moves so they can be rendered in chat
    broadcast(socket, 'submitMove', key, socket.nick, timestamp)
  });

  // send chat mesages
  socket.on('message', function(msg, timestamp){
    broadcast(socket, 'message', msg, socket.nick, timestamp);
  });

  // broadcast user joining
  socket.on('join', function(nick){
    if (socket.nick) return;
    socket.nick = nick;
    socket.emit('joined');
    broadcast(socket, 'join', nick);
  });
});

// periodically tally the move votes, perform the move, and then clear the moves array:
setInterval(function () {
  var winningMove = mode(moves);
  if (winningMove) {
    redis.get('crowdmu:move-last:', function(err, last){
      if (err) {
        throw err;
      }
      redis.set('crowdmu:move-last:', Date.now());
      redis.publish('crowdmu:move', keys[winningMove]);
      // socket.emit('move', winningMove, socket.nick); // do we need these?
      // broadcast(socket, 'move', winningMove, socket.nick); // do we need these?
      for (id in CLIENTS) {
        CLIENTS[id].hasVoted = false
      }
      io.sockets.emit('sendVoteCount', {});
      moves = [];
      voteCount = {};
    });
  }
}, 3000);
// jumbotron show a new person every x seconds
setInterval(function() {
  if (currentStreamerSocket && Object.keys(CLIENTS).length > 0) {
    console.log(Object.keys(CLIENTS), 'currentSTREAMER:', currentStreamerSocket.id)
    var randomSocket = CLIENTS[Object.keys(CLIENTS)[Math.floor(Math.random() * Object.keys(CLIENTS).length)]];
    if (randomSocket.id !== currentStreamerSocket.id) {
      currentStreamerSocket.emit('stop-streaming')
      // set new streamer
      currentStreamerSocket = randomSocket;
      currentStreamerSocket.emit('become-streamer', {allIDs: Object.keys(CLIENTS), myID: currentStreamerSocket.id})
    }
    // for (id in CLIENTS) {
    //   CLIENTS[id].emit('listen-from-streamer', currentStreamerSocket.SDP)
    // }
  }
}, 6000)
// sends connections count to everyone
// by aggregating all servers
function updateCount(total){
  redis.hset('crowdmu:connections', uid, total);
}

// broadcast events and persist them to redis

function broadcast(socket/*, …*/){
  var args = Array.prototype.slice.call(arguments, 1);
  redis.lpush('crowdmu:log', JSON.stringify(args));
  redis.ltrim('crowdmu:log', 0, 20);
  socket.broadcast.emit.apply(socket, args);
}
}
