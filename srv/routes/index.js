var express = require('express');
var chat = require('chessmate');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// GET test chat implementation
router.get('/testChat', function(request, response) {
    var id = chat.registerClient(request, response);
    response.render('chat.ejs', { title: 'Hello World', id: id });
});

// Request contains id and a string
router.post('/testChat', function(request, response) {
    chat.receive(request, response);
});

module.exports = router;