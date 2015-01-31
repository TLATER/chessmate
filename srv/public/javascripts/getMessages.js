var stream = new EventSource('/testChat/messageDistribute');
stream.onmessage = function(response) {
    window.clientId = response.lastEventId;

    console.log(response);

    var newText = document.createElement('div');

    if (response.data.length > 70) {
        splitLines(response.data);
    }

    newText.innerHTML = response.data;
    document.getElementById('display').appendChild(newText);
};

var splitLines = function (string) {
    var lines = [string.slice(0, 70), string.slice(70)];

        var i = 1;
        var lastLine = lines[i];

        while (lastLine > 70) {
            lines[i+1] = lastLine.slice(70);
            lastLine = lastLine.slice(0, 70);

            i++;
            lastLine = lines[i];
        }

        return lines.join('\n');
};