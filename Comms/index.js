// The 'glue' file. Holds all communications together
var uiCommunication = require('uiCommunication');
var Bus = require('systemBus');

function server() {
    var object = new uiCommunication();
}

server.prototype.receive = function(request, response) {

};

module.exports = server;