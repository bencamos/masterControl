var include = require('./../includes.js')
module.exports.run = async (socket) => {
  include.s.write(socket, "pwnage\n");
}