//Add this function to the click event of the element with the id test
$('#test').click(function() {

    //Start ajax request
    $.ajax({
        type: "POST",
        url: "/lauren",

        success: function(response) {
            alert(response);
        },

        error: function() {
            $.ajax(this);
        }
    });
});