var MessageDistribute = function(client, message, room) {
    this.client = client;
    this.message = message;
    this.room = room;

    this.broadcast = broadcast;
};

var broadcast = function() {

    var string = this.client.id + "says: " + this.message;

    for (var i=0; i<this.room.length; i++) {
        // this.room[i].response.writeHead(200, {
        //     'Content-Type': 'text/event-stream',
        //     'Cache-Control': 'no-cache',
        //     'Connection': 'keep-alive'
        // });

        this.room[i].response.write('id:' + this.room[i].id + '\n\n');
        this.room[i].response.write('data:' + string + '\n\n');
    }
};

module.exports = MessageDistribute;