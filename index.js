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
    var id = escapeHtml(request.body.id);
    var msg = escapeHtml(request.body.msg);

    console.log(id + ', ' + msg);

    var callingClient = findById(id);

    callingClient.stayAlive();

    if (!(msg === undefined)) {
        var send = new Text(callingClient, msg, currentUsers);
        send.broadcast();
    }
    else
        response.send('Done');
};

//Credit where credit is due, this is useful, mate. github.com/kiprobinson,
// http://stackoverflow.com/questions/1787322/
//                     htmlspecialchars-equivalent-in-javascript/4835406#4835406
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