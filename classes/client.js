// Create a Client that holds the request/response for a browser
var Client = function(id, request, response) {
    this.id = id;
    this.request = request;
    this.response = response;
    this.alive = 3;
    this.timer;

    this.stayAlive = stayAlive;
    this.die = die;
};

// Keeps the Client object alive; If 0 the Client is deleted
var stayAlive = function() {
    this.alive = 3;
    return;
};

var die = function() {
    var dead = this.alive === 0;

    if (dead) {
        clearInterval(this.timer);
    } else {
        this.alive -= 1;
    }

    return dead;
};

module.exports = Client;