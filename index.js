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
    if (client.die()) {
        currentUsers.splice(client.id, 1);
        console.log('dead');
    }
};

var findById = function (id) {
    for (var i=0; i<currentUsers.length; i++)
        if (currentUsers[i].getId() === parseInt(id, 10))
            return currentUsers[i];

    return null;
};

var receive = function (request, response) {
    console.log('Stay alive ' + request.body.id);
    console.log( findById(request.body.id) );
};

exports.registerClient = registerClient;
exports.receive = receive;