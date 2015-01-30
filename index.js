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

        console.log(i);
        console.log(currentUsers[i].getId());
        console.log(currentUsers.length);

        if (currentUsers[i].getId() === id)
            return currentUsers[i];

    return 'Looking for id ' + id + ' gave no results, even if there is '
            + currentUsers[id].getId();
};

var receive = function (request, response) {
    console.log('Stay alive ' + request.body.id);
    console.log( findById(request.body.id) );
};

exports.registerClient = registerClient;
exports.receive = receive;