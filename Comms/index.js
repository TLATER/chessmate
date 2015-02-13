// The 'glue' file. Holds all communications together
var Bus = require('systemBus');
var uiComms = require('uiCommunication');

function server() {
    Bus.on('receivedMove', function() {
        uiComms.broadcast('Test');
    });
}

server.prototype.receive = function(request) {
    Bus.emit('receivedMove', request.body);
};

server.prototype.register = function(response) {
    uiComms.registerClient(response);
};

var serv = new server();

module.exports = serv;