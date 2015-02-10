// The 'glue' file. Holds all communications together
var uiCommunication = require('uiCommunication');

function server() {
    //{ something:something }
    var object = new uiCommunication(request, response);
}

server.prototype.receive = function(request, response) {

};

module.exports = server;