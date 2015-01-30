var Client = require('./classes/client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length;
    var newClient = new Client(id, request, response);
    currentUsers.push(newClient);
    currentUsers[id].timer = setInterval(function() {killClient (id)}, 10000);
    return id;
};

// Tests client every to see if they are still alive
var killClient = function (id) {
    if (currentUsers[id].alive === 0) {
        clearInterval(currentUsers[id].timer);
        currentUsers.splice(id, 1);
        console.log("Killed client " + id);
    } else {
        currentUsers[id].alive -= 1;
    }
};

var receive = function (request, response) {
    console.log(request.body.id);
    console.log(currentUsers[0].id);
    currentUsers[request.body.id].stayAlive();
};

exports.registerClient = registerClient;
exports.receive = receive;