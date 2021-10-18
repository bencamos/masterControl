var include = require('./includes.js')

// The general idea was to complete seperate each connection into its on thread generating and killing on each data trasnfer.
// But the amount of data needed to be send and transfeered thru the threads especially when objects dont transfer was to much.
// Instead we are using the fallback method where we just thread long running proccess adding them into the threadtracker.
// This file will run all the threads in its own thread sorta like a "hub" hence the name.
// It will listen for messages search through the tracker for the requesting and then getting the main thread to run it.

// The actual file doing proccessing is called "threadProccess.js".
// It uses wonky message channel setups to even communicate properly but it works.

// Current setup using broadcast channel "main" to send data bewtween threads.
// All threads get all data but only proccess when the id is matching their own.
// Any negative ids are hard coded threads that perfom specific tasks.
// Any positive ids are generated threads that perfom tasks for clients.

const {
  Worker, SHARE_ENV, isMainThread, parentPort, workerData, BroadcastChannel
} = require('worker_threads');
var threadHub = include.globalVars.threadHub;
var mainThread = include.globalVars.mainThread;
var bc = new BroadcastChannel('main', {
   type: 'node',
   webWorkerSupport: true
 })

if (isMainThread) {
  threadHub.on('error', (err) => {console.log(err)});
  threadHub.on('exit', (code) => {console.log(`Worker error: ${code}`)});
  threadHub.on("message", request => {
    include.threading.getData(request);
  });
  bc.onmessage = (event) => {
    var data = event.data;
    include.threading.getData(data);
  };
}
module.exports.getData = async (temp) => {
  if (!isMainThread) {
      return 0;
  }
  var buffer = temp.split("|");
  var threadId = buffer[0];
  var request = buffer[1];
  if (threadId == "0") {
    switch (request.replace(/(\r\n|\n|\r)/gm, "")) {
      case "admins": {
          bc.postMessage(`-1|admins|${include.globalVars.admins.size}`)
          break;
      }
      case "connections": {
          bc.postMessage(`-1|connections|${include.globalVars.connected.size - include.globalVars.authenticating.size - include.globalVars.admins.size}`)
          break;
      }
      default: {
        // If we have a new line print it raw, if we dont use console.log
        var match = /\r|\n/.exec(request);
        if (match) {
          process.stdout.write(request);
        } else {
          console.log(request);
        }
      }
    }
  } else {
    switch (request) {
      case 'temp': {
        threadHub.postMessage(`${threadId}|${request}`)
        break;
      }
    }
  }
}
