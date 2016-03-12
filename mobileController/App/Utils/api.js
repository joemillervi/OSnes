var api = {
  PairController(ipAddress) {
    var url = 'http://' + ipAddress + ':1337/pair-controller';
    console.log(url);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback(result._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  Press(ipAddress, playerID, button, callback) {
    var url = 'http://' + ipAddress + ':1337/player/' + playerID + '/press/' + button;
    console.log(url);
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback(result._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  Release(ipAddress, playerID, button, callback) {
    var url = 'http://' + ipAddress + ':1337/player/' + playerID + '/release/' + button;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(result) {
      callback(result._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

};

module.exports = api;
