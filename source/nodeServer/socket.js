var include = require('./includes.js')
var crypto = require("crypto");
module.exports.write = (socket, text) => {
    include.globalVars.keys.forEach(a => {
      if (a.address == `${socket.remoteAddress}:${socket.remotePort}`) {
        if (a.encrypt == "unencrypted") {
          socket.write(text);
          return;
        }
        var encryptedData = crypto.publicEncrypt({
            key: `-----BEGIN PUBLIC KEY-----\n${a.encrypt}\n-----END PUBLIC KEY-----`,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            format: 'pem'
        },
         Buffer.from(text)
       )
        var enc = encryptedData.toString("base64");
        socket.write(enc);
      }
    })
}