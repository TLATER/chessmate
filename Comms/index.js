var uiInteraction = require('uiInteraction');

function server() {
    //{ something:something }
    var object = new uiInteraction(request, response);
}

server.prototype.receive = function(request, response) {

};

module.exports = server;