window.onload = function() {
    var socket = io.connect('/');
    var input = document.getElementById('input');
    var sendButton = document.getElementById('sendButton');

    socket.on('message', function (data) {
        if (data.move) {
            console.log(data.move);
        }
        if (data.board) {
            console.log(data.board);
        }
        if (data.message) {
            $('#messages').append("<div class='chatMessage'>" + data.message
                                                                    + "</div>");
            console.log(data.message);
        }
    });
    sendButton.onclick = function() {
        var text = input.value;
        socket.emit('send', { message: text });
        input.value = '';
    };
    input.onkeypress = function(keypress) {
        if (keypress.keyIdentifier === 'Enter') {
            var text = input.value;
            socket.emit('send', { message: text });

            input.value = '';
        }
    };
};