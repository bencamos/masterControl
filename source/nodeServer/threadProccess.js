var include = require('./includes.js')
const {
  Worker, SHARE_ENV, isMainThread
} = require('worker_threads');
if (isMainThread) return 0;

var requesting, responseTracker, bufferArray, threadTracking, threadHub, threadId;
mainThread = include.globalVars.mainThread;
threadHub = include.globalVars.threadHub;
threadId = require('worker_threads').workerData;

//mainThread.postMessage(`${threadId}|`)
mainThread.on('message', (temp) => {
  var buffer = `${temp}`
  if (buffer.includes("|")) {
    bufferArray = temp.split("|")
  }
  var id = bufferArray[0];
  if (!id == threadId) return 1;

  var request = bufferArray[1]
  switch (request) {
    case "temp": {
      console.log("Here")
      break;
    }
  }
});

