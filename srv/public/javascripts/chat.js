window.onload = function() {
    var socket = io.connect('/');

    socket.on('message', function (data) {
        alert(data.message);
    });
};
