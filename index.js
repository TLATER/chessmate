var Client = require('./classes/client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length;
    var newClient = new Client(id, request, response);
    currentUsers.push(newClient);
    newClient.timer = setInterval(function() {killClient (newClient)}, 10000);

    return id;
};

// Tests client to see if they are still alive
var killClient = function (client) {
    if (client.die()) {
        currentUsers.splice(client.id, 1);
    }
};

var findById = function (id) {
    for (var i=0; i<currentUsers.length; i++)
        if (currentUsers[i].id === parseInt(id, 10))
            return currentUsers[i];

    return null;
};

var receive = function (request, response) {
    findById(request.body.id).stayAlive();

    response.send('Done');
};

exports.registerClient = registerClient;
exports.receive = receive;