var Client = require('./classes/client');
var Text = require('./classes/messageDistribute');

//Holds all current clients
var currentUsers = [];

//Registers a new client
var registerClient = function (request, response) {
    var id = currentUsers.length;
    var newClient = new Client(id, request, response);
    currentUsers.push(newClient);
    //Try to kill the client every minute; need to figure out a better interval
    newClient.timer = setInterval(function() {killClient (newClient)}, 60000);

    return id;
};

//Tests if the client should die and removes it from array if so
var killClient = function (client) {
    if (client.die())
        currentUsers.splice(client.id, 1);
};

//Returns the client with the given id from the array, necessary when one is
//  deleted and therefore moved all clients down, meaning array[id] doesn't work
var findById = function (id) {
    for (var i=0; i<currentUsers.length; i++)
        if (currentUsers[i].id === parseInt(id, 10))
            return currentUsers[i];

    return null;
};

//Receive message from client
var receive = function (request, response) {
    var id = escapeHtml(request.body.id);
    var msg = escapeHtml(request.body.msg);

    var callingClient = findById(id);
    console.log('Calling client: ' + id);
    console.log('Remaining lifetime: ' + callingClient.alive);

    callingClient.stayAlive();

    //If msg is undefined the message is just there to keep the client alive
    if (!(msg === undefined)) {
        var send = new Text(callingClient, msg, currentUsers);
        send.broadcast();
    }

    //Remember to return a response so that the server doesn't clog!
    response.send('Request accepted');
};

/*
   Escapes <>&' and " to avoid injection hacks; DO implement this everywhere
   we receive data! I'll make a class that contains handy things like this later

   Credit where credit is due, this is useful, mate. github.com/kiprobinson,
   http://stackoverflow.com/questions/1787322/
                       htmlspecialchars-equivalent-in-javascript/4835406#4835406
*/
function escapeHtml(text) {

  if (text === undefined)
    return undefined;
  if (text === '')
    return undefined;

  var map = {
    '&': '&amp;',
    '<': '#lt;',
    '>': '#gt;',
    '"': '#quot;',
    "'": '#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

exports.registerClient = registerClient;
exports.receive = receive;