var stream = new EventSource('/testChat/messageDistribute');
stream.onmessage = function(response) {
    clientId = response.lastEventId;

    var newText = document.createElement('div');
    newText.innerHTML = response.data;
    document.getElementById('display').appendChild(newText);
};