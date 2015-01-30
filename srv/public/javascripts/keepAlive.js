setInterval(function() {
    $.ajax({
        type: "POST",
        url: "/player",
        data: 'id=clientId',
        success: function(msg) {
            console.log(msg);
        }
    });
}, 5000);