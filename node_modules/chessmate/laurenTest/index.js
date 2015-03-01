//Constructor
var laurenTest = function(request, response) {
    this.request = request;
    this.response = response;
    this.message = 'Hello World!';

    this.respond = respond;
};

//Respond with the message defined in the object
var respond = function(response) {
    this.response.send(this.message);
};

module.exports = laurenTest;