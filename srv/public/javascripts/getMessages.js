var stream = new EventSource('/testChat/messageDistribute');
stream.onmessage = function(response) {
    //var clientId = response.body.id;
    console.log(response);
    var newText = document.createElement('div');
    newText.innerHTML = response;
    document.getElementById('display').appendChild(newText);
};