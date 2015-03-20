/*THIS FILE SHOULD ONLY CONTAIN "router.mode()" EXPRESSIONS
 *USE A SEPERATE FILE WITH 'require()' TO WRITE NEW CODE AND ROUTE TO IT
 */
var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
    var username;
    if (request.session.username === undefined)
        username = 'Guest';
    else
        username = request.session.username;

    response.render('index', { title: 'Chessmate', user: username });
});

router.get('/game', function(request, response) {
    var username;
    if (request.session.username === undefined)
        username = 'Guest';
    else
        username = request.session.username;

    response.render('game', { user: username });
});

router.get('/register', function(request, response){
    var username;
    if (request.session.username === undefined)
        username = 'Guest';
    else
        username = request.session.username;

    response.render('register', { title: 'register', user: username });
});

router.get('/login', function(request, response){
    var username;
    if (request.session.username === undefined)
        username = 'Guest';
    else
        username = request.session.username;

    response.render('login', { title: 'login', user: username });
});

module.exports = router;