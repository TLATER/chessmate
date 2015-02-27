/*THIS FILE SHOULD ONLY CONTAIN "router.mode()" EXPRESSIONS
 *USE A SEPERATE FILE WITH 'require()' TO WRITE NEW CODE AND ROUTE TO IT
 */
var express = require('express');
var chat = require('chessmate/testChat');
var router = express.Router();
var lauren = require('chessmate/laurenTest');
var srv = require('chessmate/Comms');
/* GET chess room page */
router.get('/chess-room', function(request, response) {
    response.render('chess', { name: 'lauren' });
});

/* POST on the chess room page, currently request contains a command */
router.post('/chess-room', function(request, response) {
    srv.receive(request);
});

router.get('/', function(request, response) {
    response.render('index.ejs', { title: 'Chessmate' });
});

//Lauren's design test implementation. Use this if you want to fiddle
router.get('/login', function(request, response) {

    response.render('login.ejs', { title: 'Chessmate'});
});

router.get('/socketTest', function(request, response) {
    response.render('socket/socketTest.ejs');
});


























/*THESE ARE JUST FOR TESTING*/
// GET test chat implementation
router.get('/testChat', function(request, response) {
    response.render('chat.ejs', { title: 'Hello World'});
});

// GET for the message distribution. Responds with a continuous stream that
//  contains all chat events.
router.get('/testChat/messageDistribute', function(request, response) {
    var id = chat.registerClient(request, response);

    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    response.write("retry: 5000\n");

    // Write first message manually
    response.write('id:' + id +'\n\n');
    response.write('data:I\'m a wizard, Hagrid!\n\n');
});

//If testChat receives a message send to all clients
router.post('/testChat', function(request, response) {
    chat.receive(request, response);
});

//Lawrence's test implementation


module.exports = router;