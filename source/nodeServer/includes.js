// You need to make sure where you place the requires to prevent circular dependicies
// The connections files make calls to globalVars and threading so they need to be placed after.
//
module.exports.communications = require('./communications.js');
module.exports.globalVars = require('./globalVars.js');
module.exports.encryption = require('./encryption.js');
module.exports.threading = require('./threading.js');
module.exports.server = require('./server.js');
module.exports.admin = require('./admin.js');
module.exports.main = require('./index.js');
module.exports.s = require('./socket.js');

module.exports.version = "2.0.0 | Now With Multithreading!";
module.exports.threadProccess = require('./threadProccess.js');
module.exports.ui = require('./termUi.js');
