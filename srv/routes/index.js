/*THIS FILE SHOULD ONLY CONTAIN "router.mode()" EXPRESSIONS
 *USE A SEPERATE FILE WITH 'require()' TO WRITE NEW CODE AND ROUTE TO IT
 */
var express = require('express');
var chat = require('chessmate/testChat');
var router = express.Router();
var lauren = require('chessmate/laurenTest');

/* Be careful activating these, they might crash the server and you won't get
   errors ATM. I need to fix that */
//var srv = require('chessmate/Comms');
//var server = new srv();

/* GET home page */
router.get('/', function(request, response) {
    response.render('index', { title: 'Express' });
    console.log(request);
});

/* GET login page */
router.get('/login', function(request, response) {
    response.render('login');
});

/* GET chess room page */
router.get('/chess-room', function(request, response) {
    response.render('chess');
});

/* POST on the chess room page, currently request contains a command */
router.post('/chess-room', function(request, response) {
    /* LAWRENCE'S TEAM'S CODE GOES HERE, ACCESS THIS PAGE WITH
     * http://www.tlater.net:3597/chess-room
     * FOR TESTING
     */
    response.send(request.body);
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

/*Most basic webapp implementation. Read all the code that is referenced within
  these if you need to learn*/

//Lauren's mongooseDB test implementation. Use this if you want to fiddle
router.get('/lauren', function(request, response) {
    response.render('lauren.ejs', { title: 'laurenTest' });
});

//Lauren's mongooseDB test webapp. Use this if you want to fiddle
router.post('/lauren', function(request, response) {
    var webapp = new lauren(request, response);

    webapp.respond();
});

//Lawrence's test implementation


module.exports = router;