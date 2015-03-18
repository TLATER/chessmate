function gamesConnect() {
    var gamesSocket = io.connect('/gameRooms');
    var input = document.getElementById('input');
    var output = $('#messages');

    gamesSocket.on('message', function(data) {
        output.append("<div class='chatMessage'>" + data +"</div>");
        var height = output[0].scrollHeight;
        output.scrollTop(height);
    });
}

function lobbyConnect() {
    var lobbySocket = io.connect('/lobbyRooms');
    var input = document.getElementById('lobbyInput');
    var output = $('#lobbyMessages');

    lobbySocket.on('message', function(data) {
        console.log(data);
        if (data.message !== undefined) {
            output.append("<div class='chatMessage'>" + data.message +"</div>");
            var height = output[0].scrollHeight;
            output.scrollTop(height);
        }
    });

    lobbySocket.on('welcome', function(data) {
        console.log(data);
        if (data !== undefined) {
            output.append("<div class='welcomeMessage'>" + data +"</div>");
            var height = output[0].scrollHeight;
            output.scrollTop(height);
        }
    });

    input.onkeypress = function(keypress) {
        if (keypress.keyIdentifier === 'Enter') {
            var text = input.value;

            if (text === '/newGame')
                lobbySocket.emit('newGame');
            else
                lobbySocket.emit('send', { message: text });

            input.value = '';
        }
    };
}