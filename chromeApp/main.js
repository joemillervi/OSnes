chrome.app.runtime.onLaunched.addListener(function(intentData) {
  chrome.app.window.create('index.html', {
      width: 800,
      height: 600
  });
  var ipAddresses;
});
