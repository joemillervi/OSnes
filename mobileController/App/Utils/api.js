var api = {
  PairController(ipAddress) {
    var url = 'http://' + ipAddress + '/pair-controller';
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

  Press(ipAddress, playerID, button) {
    var url = 'http://' + ipAddress + '/player/' + playerID + '/press/' + button;
    return fetch(url, {
      method: 'POST',
      body: null
    });
  },

  Release(ipAddress, playerID, button) {
    var url = 'http://' + ipAddress + '/player/' + playerID + '/release/' + button;
    return fetch(url, {
      method: 'POST',
      body: null
    });
  },

};

module.exports = api;
