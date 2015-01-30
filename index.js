var Client = require('./classes/client');

var currentUsers = [];

var registerClient = function (request, response) {
    var id = currentUsers.length + 1;
    currentUsers.push(new Client(id, request, response));
    currentUsers.push('something');

    console.log(currentUsers[id]);

    // currentUsers[id].timer = setInterval(removeClient(id), 10000);

    return id;
};

//Tests client every to see if they are still alive
// var removeClient = function (id) {
//     if (currentUsers[id].alive === 0)
//         currentUsers.splice(id, 1);

//     currentUsers[id].alive -= 1;
// };

var receive = function (request, response) {
    console.log(request.body.id);
};

exports.registerClient = registerClient;
exports.receive = receive;