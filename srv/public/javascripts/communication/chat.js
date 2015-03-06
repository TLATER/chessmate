window.onload = function() {
    var socket = io.connect('/');
    var input = document.getElementById('input');
    var output = $('#messages');

    socket.on('message', function (data) {
        if (data.move) {
            console.log(data.move);
        }
        if (data.board) {
            console.log(data.board);
        }
        if (data.message !== undefined) {
            output.append("<div class='chatMessage'>" + data.message +"</div>");
            var height = output[0].scrollHeight;
            output.scrollTop(height);
            console.log(data.message);
        }
    });

    input.onkeypress = function(keypress) {
        if (keypress.keyIdentifier === 'Enter') {
            var text = input.value;
            socket.emit('send', { message: text });

            input.value = '';
        }
    };
};