var messages = [];
var m = document.getElementById('m');
var sendButton = document.getElementById('sendButton');
var socket = io.connect('http://www.tlater.net');
var content = document.getElementById('messages');

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
            var text = m.value;
            socket.emit('send', { message: text });
        };
    }
    catch (error) {console.log(error)}
};