/*
 * Works as a system bus for all modules.
 *
 * @exports: mpdOnline, the constructor of the server
 *
 * @public: registerClient, takes a response stream and initializes
 *          client handling for that client.
 */

//var metaCalc = require('metaCalc');
var mpdConnections = require('mpdConnections');
var clientPasser = require('clientPasser');

//Constructor
function mpdOnline() {
    //Creates a new mpd client
    var mpc = new mpdConnections();

    //Holds all currently conencted clients
    var clients = [];

    //Adds new client to array
    this.clientsPush = function(client) {
        clients.push(client);
    };

    //Sends new metadata to all connected clients
    function broadcastSong(metadata) {
        clients.forEach(function(client) {
            client.sendSong(metadata);
        });
    }

    //Send song to specific client
    this.sendSong = function(client) {
        mpc.querySong(false);
        mpc.once('sendSong', function(metadata) {
            client.sendSong(metadata);
        });
    };

    //If we receive information send it to all clients
    mpc.on('broadcastSong', function(metadata) {
        broadcastSong(metadata);
    });
}

//Registers a new client and sends first song information
mpdOnline.prototype.registerClient = function(response) {
    response.write('data:Test\n\n');
    var newClient = new clientPasser(response);
    this.clientsPush(newClient);
    this.sendSong(newClient);
};

module.exports = mpdOnline;