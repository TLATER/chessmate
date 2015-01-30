var clientId;

setInterval(function() {
    $.ajax({
        type: "POST",
        url: "/testChat",
        data: 'id=' + clientId,
        success: function(msg) {
        }
    });
}, 5000);

    // $.ajax({
    //     type: "POST",
    //     url: "/testChat",
    //     data: 'id=' + clientId + 'msg=' + message,
    //     success: function(msg) {
    //         console.log(msg);
    //     }
    // });