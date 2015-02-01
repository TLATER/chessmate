var express = require('express');
var chat = require('chessmate/testChat');
var router = express.Router();
var lauren = require('chessmate/laurenTest');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

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


module.exports = router;