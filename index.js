var Client = require('./classes/client');
var Text = require('./classes/messageDistribute');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length;
    var newClient = new Client(id, request, response);
    currentUsers.push(newClient);
    newClient.timer = setInterval(function() {killClient (newClient)}, 10000);

    return id;
};

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
    var callingClient = findById(request.body.id);
    console.log(callingClient);

    callingClient.stayAlive();

    if (!request.body.msg === undefined) {
        var send = new Text(callingClient, request.body.msg, currentUsers);
        send.broadcast();
    }
    else
        response.send('Done');
};

exports.registerClient = registerClient;
exports.receive = receive;