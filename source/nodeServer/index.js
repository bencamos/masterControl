process.env.UV_THREADPOOL_SIZE=1024;var include=require("./includes.js");const readline=require("readline").createInterface({input:process.stdin,output:process.stdout});
const {
  Worker, SHARE_ENV, isMainThread, parentPort, workerData
} = require('worker_threads');

var main = async () => {
  if (isMainThread) include.server.runServer();
}

main()
