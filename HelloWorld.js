var express = require('express');
var app = express();

app.get('/', function (request, response) {
    response.send('Hello World');
});

app.get('/test', function (request, response) {
    response.send('My my, this is cool :)')
})

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s%s', host, port);
});