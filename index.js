var Client = require('./classes/client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length;
    var newClient = new Client(id, request, response);
    currentUsers.push(newClient);

    console.log(currentUsers[0].alive);
    console.log(id);

    currentUsers[id].timer = setInterval(removeClient(id), 10000);

    return id;
};

// Tests client every to see if they are still alive
var removeClient = function (id) {
    if (currentUsers[id].alive === 0)
        currentUsers.splice(id, 1);

    currentUsers[id].alive -= 1;
};

var receive = function (request, response) {
    //console.log(request.body.id);
};

exports.registerClient = registerClient;
exports.receive = receive;