var stream = new EventSource('/testChat');
stream.onmessage = function(response) {
    var newText = document.createElement('div');
    newText.innerHTML = response;
    document.getElementById('display').appendChild(newText);
};