// A function to send a message to a Client
var sendMessage = function(message) {
    this.response.send(message);
};

// Create a Client that holds the request/response for a browser
var Client = function(id, request, response) {
    this.id = id;
    this.request = request;
    this.response = response;

    this.sendMessage = sendMessage;
    console.log("Client registered: " + this.id);
};

module.exports = Client;