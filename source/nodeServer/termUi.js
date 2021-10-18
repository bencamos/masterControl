// Here we run the terminal UI displaying all information.
var include = require('./includes.js')
var execSync = require('child_process').execSync;
const {
  Worker, SHARE_ENV, isMainThread, parentPort, BroadcastChannel
} = require('worker_threads');

if (isMainThread) return 0;

var title = "\nA███╗   ███╗ █████╗ ██╗     ██╗    ██╗ █████╗ ██████╗ ███████╗██╗  ██╗██╗   ██╗██████╗ \n████╗ ████║██╔══██╗██║     ██║    ██║██╔══██╗██╔══██╗██╔════╝██║  ██║██║   ██║██╔══██╗\n██╔████╔██║███████║██║     ██║ █╗ ██║███████║██████╔╝█████╗  ███████║██║   ██║██████╔╝\n██║╚██╔╝██║██╔══██║██║     ██║███╗██║██╔══██║██╔══██╗██╔══╝  ██╔══██║██║   ██║██╔══██╗\n██║ ╚═╝ ██║██║  ██║███████╗╚███╔███╔╝██║  ██║██║  ██║███████╗██║  ██║╚██████╔╝██████╔╝\n╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ";

var holder, holder2, debug, connLog = "";
var k, i, admins = 0, connections = 0;
var j = 0;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

var bc = new BroadcastChannel('main', {
   type: 'node',
   webWorkerSupport: true
 })

bc.onmessage = (event) => {
  var temp = event.data;
  print(`DATA: ${temp}`)
  var buffer = temp.split("|");
  var threadId = buffer[0];
  var dataType = buffer[1];
  var data = buffer[2];
  if (!threadId == "-1") return 1;
  switch (dataType) {
    case "log": {
      debug = debug + data;
      break;
    }
    case "connLog": {
      connLog = connLog + data;
      break;
    }
    case "admins": {
      admins = data;
      break
    }
    case "connections": {
      connections = data;
      break
    }
  }
};

async function print(text) {
  bc.postMessage(`0|${text}`)
}

async function getData() {
  bc.postMessage(`0|admins`)
  bc.postMessage(`0|connections`)
}

bc.onmessageerror = (event) => {
  print(event)
}

async function start() {
  //if (isMainThread) return 1;
  while (true) {
    j++
    var width = parseInt(execSync(`tput cols`, {
          encoding: 'utf-8'
        }));
    var height = parseInt(execSync(`tput lines`, {
          encoding: 'utf-8'
        }));
    // Centering title text
    i = (width - 86) / 2; // 86 is the length of each line
    if (i < 0) i = 0;
    holder = "";
    k = 0;
    while (k < i) {
      holder = holder + " ";
      k++;
    }
    print("\033[2J\033[1H")
    print(title.replaceAll("\nA", `${holder}`).replaceAll("\n", `\n${holder}`))

    // Top Line seperator
    holder = "\n";
    i = width;
    k = 0;
    while (k < i) {
      holder = holder + "═";
      k++;
    }
    print(holder);

    // Logging
    getData();
    holder = `[Administrators: ${admins}]`
    holder2 = `[Connections: ${connections}]`;
    print(connLog)
    print(holder)
    print(holder2)
    print(j)
    execSync(`sleep .25`);
  }
}
var uiThread =new Worker(`${start()}`,{eval:!0, env: SHARE_ENV});

// We need to start this thread here otherwise it just dosen't work.
