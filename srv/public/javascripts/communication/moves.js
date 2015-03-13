// You should probably use the file I've made for you... Chat.js contains all
// the framework you need. you only need to change the logic.

window.onload =function() {
    var socket = io.connect('/');
    var input = socket.getElementById('input');
    var output; // = $('#messages');

    var gameBoardRef =

    socket.on('message', function (data) {
        if (data.move) {
            // Get move info from engine
            // insert piece on to correct div (boardCell)
            console.log(data.move);
        }
    });
};