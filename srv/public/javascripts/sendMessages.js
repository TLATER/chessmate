setInterval(function() {
    $.ajax({
        type: "POST",
        url: "/testChat",
        data: 'id=' + window.clientId,
        success: function(msg) {
        }
    });
}, 5000);

document.getElementById('input').onkeypress = function(event) {
    if (event.keyIdentifier === "Enter") {

        console.log('yep');

        // $.ajax({
        //     type: "POST",
        //     url: "/testChat",
        //     data: 'id=' + clientId + 'msg=' + message,
        //     success: function(msg) {
        //         console.log(msg);
        //     }
        // });
    }
};