/*
 * Keeps track of all connected clients and passes data to each whenever new
 * data is available.
 *
 * On call data is sent to the client for initialization.
 */

var metaCalc = require('metaCalc');
var mpdListener = require('mpdListener');
var clientPasser = require('clientPasser');

//Create a calculator for metadata
var calc = new metaCalc();

//Holds all clients
var clients = [];

//If something happens on the mpd server data is sent to the client
mpdListener.stdout.on('data', function() {
    clients.forEach(function(client) {
        client.sendData(calc);
    });
});

//Register client and send first block of data
function registerClient(response) {
    var newClientPasser = new clientPasser(response, calc);
    clients.push(newClientPasser);
    newClientPasser.sendData(calc);
}

module.exports = registerClient;