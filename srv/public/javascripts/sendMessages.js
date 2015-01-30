setInterval(function() {
    $.ajax({
        type: "POST",
        url: "/testChat",
        data: 'id=' + window.clientId,
        success: function(msg) {
        }
    });
}, 5000);

var input = document.getElementById('input');

input.onkeypress = function(event) {
    if (event.keyIdentifier === "Enter") {

        var message = input.value;
        $.ajax({
            type: "POST",
            url: "/testChat",
            data: 'id=' + window.clientId + 'msg=' + message,
            success: function(msg) {
                console.log(msg);
            }
        });
    }
};