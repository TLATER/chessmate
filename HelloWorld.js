//Require adds the "class", in this case express, our primitive but fast web
// server
var express = require('express');
//App is an implementation of express, an object, if you want
var app = express();

//app.METHOD(PATH, HANDLER) - you should be able to decipher that
//HANDLER is a function that is given a request and a response, both usable
//objects, much like the java scanner
app.get('/', function(request, response) {
    response.send('Hello World');
});

//Same as before, different folder
app.get('/test', function(request, response) {
    response.send('My my, this is cool :)');
});

//A GET handler
app.get('/', function(request, response) {
    response.send("You wanted to GET something?");
    console.log("Somebody tried to GET");
});

//Simple 404 handler - express only realizes that nothing responded and
//  therefore stops at 404, thus the last function that does not match any file
//  will only respond if it hasn't been matched before
app.use(function(request, response) {
    response.status(404).send('Sorry cant find that!');
});

//This initializes the server to port 3000
var server = app.listen(3000, function () {

    //This doesn't work for some reason
    var host = server.address().address;

    //This does
    var port = server.address().port;

    console.log('Example app listening at http://%s%s', host, port);
});