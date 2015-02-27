var messages = document.getElementById('messages');
var sendButton = document.getElementById('m');
var socket = io.connect('http://www.tlater.net');

window.onload = function() {
    
        socket.on('message', function (data) {
        if(data.message) {
            messages.push(data);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
    try
    {
 
        sendButton.onclick = function() {
            if(name.value == "") {
                alert("Please type your name!");
            } else {
                var text = field.value;
                socket.emit('send', { message: text, username: name.value });
            }
        };
    }
    catch (error) {console.log(error)}
 
};