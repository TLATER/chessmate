function lobbyConnect() {
    var lobbySocket = io.connect();
    var input = document.getElementById('lobbyInput');
    var output = $('#lobbyMessages');


    lobbySocket.on('message', function(data) {
        console.log(data);
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

            lobbySocket.emit('send', { message: text });

            input.value = '';
        }
    };
}