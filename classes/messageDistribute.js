//Create new Distributor that holds the sending client, room and message
var MessageDistribute = function(client, message, room) {
    this.client = client;
    this.message = message;
    this.room = room;

    this.broadcast = broadcast;
};

var broadcast = function() {
    var string = this.client.id + "says: " + this.message;

    //Broadcast the message to every client in the room
    for (var i=0; i<this.room.length; i++) {
        this.room[i].response.write('id:' + this.room[i].id + '\n\n');
        this.room[i].response.write('data:' + string + '\n\n');
    }
};

module.exports = MessageDistribute;