setInterval(function() {
    $.ajax({
        type: "POST",
        url: "/testChat",
        data: 'id=' + clientId,
        success: function(msg) {
            console.log(msg);
        }
    });
}, 5000);