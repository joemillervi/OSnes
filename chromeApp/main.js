/*
2 Options
Uncomment either OTPTION 1 or OPTION 2. NOT BOTH!
*/



// OPTION 1: Runs index.html which displays local IP

// chrome.app.runtime.onLaunched.addListener(function(intentData) {
//   chrome.app.window.create('index.html', {
//       width: 300,
//       height: 500
//   });
// });





// OPTION 2: Run's snes9x.html which displays emulator

chrome.app.runtime.onLaunched.addListener(function(launchData) {
    console.log('quake app launch')

    //var args = "+skill 3 +map start"
    var args = "";

    //chrome.app.window.create('Client/WebQuake.htm' + '?' + encodeURIComponent(args),
    chrome.app.window.create('snes9x.html',
                             { defaultWidth: 540,
                               id:'snes',
                               defaultHeight: 667  },
                             function(w) {
                                 console.log('window created');
                             })

})
