//Remove the browser warning if clicked on/present
$('#browserWarning').click(function() {
    $('#browserWarning').remove();
});

//Initialize increment for second increment function
var increment;

//Start the music stream for Firefox and others that don't autoplay hidden files
document.getElementById('stream').play();

//Create new stream that saves data to metadata (array)
var stream = new EventSource('/player/metaStream');

//Initialize as true because no message has been received yet
isFirstMessage = true;

stream.onmessage = function(message) {
    console.log(message);
    metadata = JSON.parse(message.data);

    //Make sure this is a song transition and not an error return
    var isError = metadata[5].value - 10 > 0 && !isFirstMessage;
    if (isError) {
        console.log('Error');
        return;
    }

    //We have received our first message
    isFirstMessage = false;

    //Remove unwanted metadata
    for (i=0; i<metadata.length; i++) {
        if (metadata[i].id ==='track') {
            metadata.splice(i, 1);
        }
    }
    
    //Fade the metadata container to transition
    setTimeout(function() {
        $('#metaWrapper').toggleClass('fade' );
    }, 0);

    //Set the data after 500 ms so that the elements have time to fade (>= 300)
    setTimeout(function() { setData(metadata); }, 500);
    
    //Emerge metadata container after objects changed
    setTimeout(function() {
        $('#metaWrapper').toggleClass('fade' );
    }, 550);

    clearInterval(increment);
    increment = setInterval(incrementTime, 1000);
}

//Sets the newly received data for all elements
function setData(metadata) {
    for (i=0; i<metadata.length; i++) {
        setValue(metadata[i].id, metadata[i].value)
    }
}

//Sets the value of the element
function setValue(id, value) {

    //If the element is a play time
    var isPlaytime = 
                 $('#' + id).hasClass('playtime') && id !== 'playtimeSeperator';

    //If the element is a play time convert the time first
    if (isPlaytime)
        $('#' + id).html(convertTime(value));
    else
        $('#' + id).html(value);
}

//Add 1 to the "played" time counter every second
function incrementTime() {
    var played = $.grep(metadata, function(element) {
        return element.id === 'played';
    });

    var total = $.grep(metadata, function(element) {
        return element.id === 'total';
    });

    if (played[0].value < total[0].value) {
        played[0].value += 1;
    } else {
        played[0].value = 0;
    }
    $('#played').html(convertTime(played[0].value));
}

//Converts time in seconds to MM:SS format
function convertTime(seconds) {
    var minutes = parseInt(seconds / 60);
    var seconds = seconds - minutes * 60;
    
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
