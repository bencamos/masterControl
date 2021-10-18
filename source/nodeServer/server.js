var include = require('./includes.js');
var cmds = require('./commandRun.js');
var net = require('net');

const {
  Worker, SHARE_ENV, isMainThread, parentPort, workerData, BroadcastChannel
} = require('worker_threads');

var threadCount = 0;
threadHub = include.globalVars.threadHub;
mainThread = include.globalVars.mainThread;

var bc = new BroadcastChannel('main', {
   type: 'localstorage',
   webWorkerSupport: true
 })

module.exports.runServer = () => {
  var server = net.createServer((socket) => {
    socket.setKeepAlive(0, 1);

    socket.on('data', function (chunk) {
      var data = chunk.toString()
      proc(socket, data.replace(/(\r\n|\n|\r)/gm,""), data)
      //new Worker("./connectionProccess.js");
    })

    socket.on('end', function(){deadConnection(socket)});
    socket.on('error', function(){deadConnection(socket)});
    socket.on('close', function(){});

  });
  server.listen(1905, "0.0.0.0", () => {/*console.log(`Running MalwareHub: ${include.version}\n\r`)*/});
  /*server.on('connection', function (socket) {
    threadCount++;
    //var temp = new Worker('./connectionInit.js', { env: SHARE_ENV, workerData: threadCount});
    var data = {
      threadCount: threadCount,
      socket: socket
    }
    newConnection(socket);
    nameGeneration(socket);
    include.globalVars.threadTracking.add(data);
  })*/
  server.on('connection', function (socket) {
    bc.postMessage(`-1|connLog|${socket.remoteAddress}:${socket.remotePort} \u001b[36;1mConnected!\u001b[0m`)
    //console.log(`${socket.remoteAddress}:${socket.remotePort} \u001b[36;1mConnected!\u001b[0m`)
    include.globalVars.keys.delete(`${socket.remoteAddress}:${socket.remotePort}`);
    include.globalVars.exchanging.delete(socket);
    include.globalVars.exchanging.add(socket);
    while (1) {
      var ranName = randomString(8);
      if (!include.globalVars.connected.has(ranName)) {
        var socketIndentification = {
          socket: socket,
          remoteAddress: `${socket.remoteAddress}:${socket.remotePort}`,
          name: ranName
        }
        include.globalVars.connected.add(socketIndentification);
        break;
      }
    }
    include.encryption.gen(socket);
  })

  server.on('error', function(err){})
}

function deadConnection(socket){
  var address = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`${socket.remoteAddress}:${socket.remotePort} \u001b[31;1mDisconnected!\u001b[0m`)
  include.globalVars.connected.forEach(a => {
    if (a.remoteAddress == address) {
      include.globalVars.connected.delete(a);
    }
  });
  include.globalVars.authenticating.delete(socket);
  include.globalVars.admins.delete(socket);
}

function newConnection(socket){
  var address = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`${socket.remoteAddress}:${socket.remotePort} \u001b[36;1mConnected!\u001b[0m`)
  include.globalVars.keys.delete(address);
  include.globalVars.exchanging.delete(socket);
  include.globalVars.exchanging.add(socket);
}

function nameGeneration(socket){
  var address = `${socket.remoteAddress}:${socket.remotePort}`;
  while (1) {
    var ranName = randomString(16);
    if (!include.globalVars.connected.has(ranName)) {
      var socketIndentification = {
        socket: socket,
        remoteAddress: address,
        name: ranName
      }
      include.globalVars.connected.add(socketIndentification);
      break;
    }
  }
}

function randomString(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
}

async function proc(socket, buffer, full){
  var address = `${socket.remoteAddress}:${socket.remotePort}`;
  if (include.globalVars.exchanging.has(socket)) {
    var keys;
    include.globalVars.keys.forEach(a => {
      if (a) {
        if (a.address == address) {
          if (buffer == "unencrypted") {
            include.globalVars.unencrypted.add(socket);
            console.log(`${address} \u001b[32;1mClear Text!\u001b[0m`);
            keys = {address:address, encrypt:`unencrypted`, decrypt:`unencrypted`}
          } else {
            var key1 = buffer.substring(buffer.indexOf("M")).split('-')[0];
            keys = {address:address, encrypt:`${buffer.substring(buffer.indexOf("M")).split('-')[0]}`, decrypt:`${a.decrypt}`}
            console.log(`${address} \u001b[32;1mEncrypted!\u001b[0m`);
          }
          include.globalVars.keys.delete(a);
          include.globalVars.exchanging.delete(socket);
        }
      }
    })
    include.globalVars.keys.add(keys);
  } else if (include.globalVars.authenticating.has(socket)) {
    var pass = include.encryption.dec(socket, buffer);
    if (pass == "pass123") {
      include.globalVars.admins.add(socket);
      include.admin.banner(socket);
      include.admin.panel(socket, buffer);
    } else {
      console.log(`Admin Login Attempted: ${buffer}`)
    }
    include.globalVars.authenticating.delete(socket);
  } else if (include.globalVars.admins.has(socket)){
    if (include.communications.run(socket, buffer, include.encryption.dec(socket, full), 1)) {
        include.admin.panel(socket, buffer);
    }
  } else {
    var data = include.encryption.dec(socket, buffer);
    if (data == "adminLogin") {
      include.globalVars.authenticating.add(socket);
      include.s.write(socket, "Password: ");
    } else {
      include.communications.run(socket, data, include.encryption.dec(socket, full), 0);
    }
  }
}