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
    console.log(event);

    // $.ajax({
    //     type: "POST",
    //     url: "/testChat",
    //     data: 'id=' + clientId + 'msg=' + message,
    //     success: function(msg) {
    //         console.log(msg);
    //     }
    // });
};