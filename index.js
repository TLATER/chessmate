var Client = require('./classes/client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length;
    var newClient = new Client(id, request, response);
    currentUsers.push(newClient);

    console.log(currentUsers[id]);

    currentUsers[id].timer = setInterval(removeClient, 10000);

    return id;
};

// Tests client every to see if they are still alive
var removeClient = function () {
    if (this.alive === 0)
        currentUsers.splice(this.id, 1);

    this.alive -= 1;
};

var receive = function (request, response) {
    //console.log(request.body.id);
};

exports.registerClient = registerClient;
exports.receive = receive;