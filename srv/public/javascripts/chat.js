window.onload = function() {
    var messages = [];
    var socket = io.connect('/');
    var field = document.getElementById("m");
    var sendButton = document.getElementById("sendButton");
    var content = document.getElementById("messages");

    socket.on('message', function (data) {
        messages.push(data.message);
        var html = '';
        for(var i=0; i<messages.length; i++) {
            html += messages[i] + '<br />';
        }
        content.innerHTML = html;
    });
    sendButton.onclick = function() {
        var text = field.value;
        socket.emit('send', { message: text });
        field.value = '';
    };
    field.onkeypress = function(keypress) {
        if (keypress.keyIdentifier === 'Enter') {
            var text = field.value;
            socket.emit('send', { message: text });

            field.value = '';
        }
    };
};