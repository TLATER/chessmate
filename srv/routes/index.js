/*THIS FILE SHOULD ONLY CONTAIN "router.mode()" EXPRESSIONS
 *USE A SEPERATE FILE WITH 'require()' TO WRITE NEW CODE AND ROUTE TO IT
 */
var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
    response.render('index', { title: 'Chessmate' });
});

router.get('/login', function(request, response) {
    response.render('login.ejs', { title: 'Chessmate'});
});

router.get('/socketTest', function(request, response) {
    response.render('socket/socketTest.ejs');
});

module.exports = router;