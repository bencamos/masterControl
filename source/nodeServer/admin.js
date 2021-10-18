var include = require('./includes.js')
var cmds = require('./commandRun.js')
module.exports.banner = async (socket) => {
  include.s.write(socket, "\033[2J\033[1H")
  await new Promise(resolve => setTimeout(resolve, 100));
  include.s.write(socket, "███╗   ███╗ █████╗ ██╗     ██╗    ██╗ █████╗ ██████╗ ███████╗██╗  ██╗██╗   ██╗██████╗ \r\n████╗ ████║██╔══██╗██║     ██║    ██║██╔══██╗██╔══██╗██╔════╝██║  ██║██║   ██║██╔══██╗\r\n██╔████╔██║███████║██║     ██║ █╗ ██║███████║██████╔╝█████╗  ███████║██║   ██║██████╔╝\r\n██║╚██╔╝██║██╔══██║██║     ██║███╗██║██╔══██║██╔══██╗██╔══╝  ██╔══██║██║   ██║██╔══██╗\r\n██║ ╚═╝ ██║██║  ██║███████╗╚███╔███╔╝██║  ██║██║  ██║███████╗██║  ██║╚██████╔╝██████╔╝\r\n╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ \r\nMetasploit Aint Got Shit on MH\n\r")
}
module.exports.panel = async (socket, command) => {
  include.s.write(socket, "\033]0;" + `[${include.globalVars.connected.size - include.globalVars.authenticating.size - include.globalVars.admins.size}] Connections` + "\007");
  await new Promise(resolve => setTimeout(resolve, 100));
  include.s.write(socket, ">> ");
  commands(socket, command);
}
function commands(socket, command) {
  var commandArray = command.split(' ');
  if (!commandArray[0] == "") {
      cmds.run(commandArray[0], socket, commandArray[1], commandArray, command);
  }
}