
var sio = require('socket.io');
var forwarded = require('forwarded-for');
var debug = require('debug');

process.title = 'crowdmu-io';

var port = process.env.CROWDMU_PORT || 3001;
var io = module.exports = sio(port);
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

var socketList = [];

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
io.on('connection', function(socket){
  // Do we need to do this or can we rely on io.sockets to be an array of all sockets?
  socketList.push(socket);
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
  socket.on('submitMove', function (key) {
    if (socket.hasVoted) {
      return;
    }
    moves.push(key);
    voteCount[key] = (voteCount[key]) ? (voteCount[key] + 1) : 1;
    io.sockets.emit('sendVoteCount', voteCount);
    socket.hasVoted = true;
  });

  // broadcast moves, throttling them first
  socket.on('move', function(key){
    if (null == keys[key]) return;
    redis.get('crowdmu:move-last:' + ip, function(err, last){
      if (last) {
        last = last.toString();
        if (Date.now() - last < throttle) {
          return;
        }
      }
      redis.set('crowdmu:move-last:', Date.now());
      redis.publish('crowdmu:move', keys[key]);
      socket.emit('move', key, socket.nick);
      broadcast(socket, 'move', key, socket.nick);
    });
  });

  // send chat mesages
  socket.on('message', function(msg){
    broadcast(socket, 'message', msg, socket.nick);
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
  if (moves.length) {
    redis.get('crowdmu:move-last:', function(err, last){
      // if (last) {
      //   last = last.toString();
      //   if (Date.now() - last < throttle) {
      //     return;
      //   }
      // }
      redis.set('crowdmu:move-last:', Date.now());
      redis.publish('crowdmu:move', keys[winningMove]);
      // socket.emit('move', winningMove, socket.nick); // do we need these?
      // broadcast(socket, 'move', winningMove, socket.nick); // do we need these?
      socketList.forEach(function (socket) { // can we do io.sockets.forEach instead?
        socket.hasVoted = false;
      });
      io.sockets.emit('sendVoteCount', {});
      moves = [];
      voteCount = {};
    });
  }
}, 3000);

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
