window.onload = function() {
    var socket = io.connect('http://www.tlater.net:3501');

    socket.on('message', function (data) {
        alert(data.message);
    });
};
