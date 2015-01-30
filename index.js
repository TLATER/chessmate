var Client = require('./classes/client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length;
    var newClient = new Client(id, request, response);
    currentUsers.push(newClient);

    console.log(currentUsers[id]);

    var check = setInterval(removeClient(id), 10000);

    console.log(check);

    currentUsers[id].check = check;

    console.log(currentUsers[id].check);

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