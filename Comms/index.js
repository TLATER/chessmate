var uiInteraction = require('uiInteraction');

function server(request, response) {
    //{ something:something }
    var object = new uiInteraction(request, response);
}

var srv = new server(request, response);