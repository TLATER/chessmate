var Client = require('client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length + 1;
    currentUsers.push = new Client(id, request, response);
    console.log(currentUsers);

    return id;
};

var removeClient = function (id) {

};

var sendMessage = function (id, message) {
    currentUsers[id].sendMessage(message);
};

exports.registerClient = registerClient;
exports.sendMessage = sendMessage;