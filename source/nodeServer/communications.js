var include = require('./includes.js')
var cmds = require('./commandRun.js');

/*
This section of code is complicated and even harder to read and understand.
Even though I wrote this code I cannot properly read it.

I will do my best to properly explain this code.

*/




module.exports.run = async (socket, buffer, full, admin) => {

  if (admin) {
    include.globalVars.choiceConfirm.forEach(a => {
      if (a.socket == socket) {
        if (buffer == "y") {
          cmds.choice(a.command, a.args, a.socket);
        }
        include.globalVars.choiceConfirm.delete(a);
        return 1;
      }
    })
  }

  include.globalVars.awaitingReply.forEach(a => {
    var sender = a.substring(a.indexOf('|') + 1);// Client who is sending data to the receiver (Usually a regular client).
    var receiver = a.substring(0, a.indexOf('|'));// Client who initiated the data transfer (Usually admins).
    var client = `${socket.remoteAddress}:${socket.remotePort}`;// This is the current client making the call

    if (sender == client) {// Checking if we have the right addresses here so we dont send to the wrong admins.
      include.globalVars.connected.forEach(b => {// Connected is a fully custom set using different variable arangments where remoteAddress is the full including port.
        if (b.remoteAddress == sender) {// Checking again for the right address and if its connected.
          include.globalVars.admins.forEach(c => {
            var temp = `${c.remoteAddress}:${c.remotePort}`;// We are pulling from a direct set so we need to get the address & port into and properly format them.
            if (temp == receiver) {// Checking again for the right address and if its an admin.
              include.s.write(c, `\nIncoming transmission from: ${sender}\n`);// Writing to the admin socket,
              include.globalVars.transmitting.push(`${receiver}|${socket.remoteAddress}:${socket.remotePort}`);// Iniating the actual data transfer.
              for (var i = 0; i < include.globalVars.awaitingReply.length; i++) {
                if (include.globalVars.awaitingReply[i] == a) {
                  include.globalVars.awaitingReply.splice(i, 1); // Just removing this entry from itself (awaitingReply).
                }
              }
              include.s.write(c, full);// Writing the first set of data to the admin socket.
            }
          });
        }
      })
    }
  })

  include.globalVars.transmitting.forEach(a => {

    // Here we basically have the same code but just checking for the terminating message and sending the data to the admin.

    // OPTIMIZE: We are reusing essentially the same code here. We can turn this into a function.


    var sender = a.substring(a.indexOf('|') + 1);
    var receiver = a.substring(0, a.indexOf('|'));
    var client = `${socket.remoteAddress}:${socket.remotePort}`;

    if (sender == client) {
      include.globalVars.connected.forEach(b => {
        if (b.remoteAddress == sender) {
          include.globalVars.admins.forEach(c => {
            var temp = `${c.remoteAddress}:${c.remotePort}`;
            if (temp == receiver) {
              if (buffer == "terminated010203") {
                include.s.write(c, "\nTransmission completed.\n");
                for (var i = 0; i < include.globalVars.transmitting.length; i++) {
                  if (include.globalVars.transmitting[i] == a) {
                    include.globalVars.transmitting.splice(i, 1);
                  }
                }
              } else {
                include.s.write(c, full);
              }
            }
          });
        }
      })
    }
  })
}