chrome.app.runtime.onLaunched.addListener(function(intentData) {
    chrome.app.window.create('index.html', {
        width: 500,
        height: 309
    });
    var ipAddresses;
    // chrome.system.network.getNetworkInterfaces(function (nets) {
    //   ipAddresses = nets;
    //   document.getElementById('ip').innerText = nets[0];
    //   console.log(nets)
    // });
});
