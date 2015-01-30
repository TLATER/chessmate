var stream = new EventSource('/testChat/getMessage');
stream.onmessage = function(response) {
    console.log(response);
};