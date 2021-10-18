var include = require('./../includes.js')
module.exports.run = async (socket, args, host) => {
  var a = args.split(' ');
  a.shift();
  a.shift();
  var b = a.toString();
  var cmd = b.replace(",", " ");
  include.s.write(socket, `${cmd}\n`);
  include.globalVars.awaitingReply.push(`${host.remoteAddress}:${host.remotePort}|${socket.remoteAddress}:${socket.remotePort}`);
}