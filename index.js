var Client = require('./classes/client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length;
    var newClient = new Client(id, request, response);
    currentUsers.push(newClient);
    newClient.timer = setInterval(function() {killClient (newClient)}, 10000);

    console.log("New client connected " + id);
    return id;
};

// Tests client to see if they are still alive
var killClient = function (client) {
    if (client.die)
        currentUsers.splice(client.id, 1);
};

var receive = function (request, response) {
    console.log('Stay alive ' + request.body.id);
    console.log('Maps to ' + currentUsers[request.body.id].id);

    currentUsers[request.body.id].stayAlive();
};

exports.registerClient = registerClient;
exports.receive = receive;