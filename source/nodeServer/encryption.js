var include = require('./includes.js')
var crypto = require("crypto");
var execSync = require('child_process').execSync
module.exports.gen = (socket) => {
  var privateKey = execSync(`openssl genrsa 4096 2>/dev/null`, {
    encoding: 'utf-8'
  });
  var publicKey = execSync(`./key.sh "${privateKey}"`, {
    encoding: 'utf-8'
  });
  var keys = {
    address: `${socket.remoteAddress}:${socket.remotePort}`,
    encrypt: "",
    decrypt: privateKey
  }
  include.globalVars.keys.add(keys);
  socket.write(`${publicKey}`);
}

module.exports.dec = (socket, text) => {
  if (include.globalVars.unencrypted.has(socket)) {
    return text;
  }
  include.globalVars.keys.forEach(a => {
    if (a.address == `${socket.remoteAddress}:${socket.remotePort}`) {
      console.log(text);
      var decryptedData = execSync(`openssl rsautl -decrypt -in <(echo "${text}") -inkey <(echo "${a.decrypt}") -pubout`, {
        encoding: 'utf-8'
      });
      return decryptedData.toString("utf8");;
    }
  })
}