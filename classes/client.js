// Keeps the Client object alive; If 0 the Client is deleted
var resetLifetime = function() {
    this.alive = 2;
};

// Create a Client that holds the request/response for a browser
var Client = function(id, request, response) {
    this.id = id;
    this.request = request;
    this.response = response;
    this.alive = 2;
    this.timer;
    console.log("Client registered: " + this.id);

    this.resetLifetime = resetLifetime;
};

module.exports = Client;