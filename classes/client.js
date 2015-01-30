// Keeps the Client object alive; If 0 the Client is deleted
var stayAlive = function() {
    console.log(this.alive);
    this.alive = 3;
};

var die = function() {
    var dead = this.alive === 0;

    if (dead) {
        clearInterval(this.timer);
        console.log("Killed client " + this.id);
    } else {
        this.alive -= 1;
    }

    return dead;
};

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

module.exports = Client;