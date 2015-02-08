//The input DOM element
var input = $('#command');

//When the send-button is clicked, send the command
$('#send-button').click(function() {
    sendCommand();
});

//Send the command in the input element
function sendCommand() {
    //Get the command
    var command = input.val();
    //Reset the input element to show nothing
    input.val('');

    //POST using ajax
    $.ajax({
        type: 'POST',
        url: '/chess-room',
        data: 'command=' + command,

        /*Log the response for now, this will contain whatever the comms server
          responds eventually (Do your job, people)*/
        success: function(response) {
            console.log(response);
        }
    });
}