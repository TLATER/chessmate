// The 'glue' file. Holds all communications together
var Bus = require('systemBus');
var uiComms = require('uiCommunication');

function server() {
}

server.prototype.receive = function(request) {
    Bus.emit('receivedMove', request.body);
};

server.prototype.register = function(response) {
    //uiComms.registerClient(response);
};

var serv = new server();

module.exports = serv;