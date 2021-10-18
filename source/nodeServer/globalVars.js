const {
  Worker, SHARE_ENV, isMainThread, parentPort, workerData, BroadcastChannel
} = require('worker_threads');

module.exports.authenticating = new Set();
module.exports.threadTracking = new Set();
module.exports.choiceConfirm = new Set();
module.exports.unencrypted = new Set();
module.exports.exchanging = new Set();
module.exports.connected = new Set();
module.exports.socketIds = new Set();
module.exports.admins = new Set();
module.exports.keys = new Set();

module.exports.awaitingReply = [];
module.exports.transmitting = [];
if (isMainThread) {
    module.exports.threadHub = new Worker("./threading.js");
    //module.exports.uiHub = new Worker('./termUi.js');
}
module.exports.bc = new BroadcastChannel('main');
module.exports.mainThread = parentPort;

var authenticating = [];
var awaitingReply = [];
var transmitting = [];
var exchanging = [];
var connected = [];
var admins = [];
var keys = [];
