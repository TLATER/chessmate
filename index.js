var Client = require('./classes/client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length + 1;
    currentUsers.push(new Client(id, request, response));

    return id;
};

var removeClient = function (id) {

};

var receive = function (request, response) {
    console.log(request.body);
};

exports.registerClient = registerClient;
exports.receive = receive;