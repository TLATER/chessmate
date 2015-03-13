function submitForm() {
    var username = $('#username').val();
    $('#username').val('');

    var password = $('#passoword').val();
    $('#password').val('');

    $.ajax({
        type: "POST",
        url: "/register",
        data: data,
        success: function(msg) {
        },
        error: function() {
            $.ajax(this);
        }
    });
}