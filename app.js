var express = require('express');
var path = require('path');
// The port we are listening on
var port = process.env.PORT ? process.env.PORT : '3000';
var favicon = require('serve-favicon');

var logger = require('morgan');
var mongoose = require('mongoose');

var user = require("./config/user");
var newU = new user();
newU.username = "Alex";

mongoose.connect('mongodb://localhost', function(){
    console.log("works!!");
});

var connection = mongoose.connection;

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var chessmate = require('chessmate');
var mate = new chessmate();

var routes = require('./srv/routes/index');

var app = express();


// View engine setup
app.set('views', path.join(__dirname, 'srv/views'));
app.set('view engine', 'ejs');

/* Make all our additional middleware work */
// This is where the favicon needs to go
app.use(favicon(__dirname + '/srv/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'srv/public')));
app.use(express.static(path.join(__dirname, 'srv/public')));

app.use(session({ secret: 'thisissome2l3mdssimbdlf'}));

require('./config/init')(passport);
require('./config/login')(passport);
require('./config/register')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/views/login');
}

//login and register routes

app.post('/login', passport.authenticate('login', {
    successRedirect: '/index',
    failureRedirect: '/login',
    failureFlash : true
  }));

/* Handle Registration POST */
app.post('/register', passport.authenticate('register', {
	successRedirect: '/',
	failureRedirect: '/error',
	failureFlash : true
}));

/* GET Home Page */
app.get('/views/index', isAuthenticated, function(req, res){
	res.render('index', { user: req.user });
});

/* Handle Logout */
app.get('/signout', function(req, res) {
	req.logout();
	res.redirect('/views/index');
});

/* Make the public and routes link to the root directory */
app.use('/', routes);
app.use(express.static(__dirname + '/srv/public'));

// Catch 404 and forward to error handler
app.use(function(request, response, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// The user will get a stacktrace... We might want to change this soon
app.use(function(err, request, response, next) {
    response.status(err.status || 500);
    response.render('error', {
        message: err.message,
        error: err
    });
});

/* The socket.io configuration begins here */
var io = require('socket.io').listen(app.listen(port));

var board;
io.sockets.on('connection', function(socket) {
    if (board === undefined)
        board = mate.createGame();
    socket.emit('message', { board: board });

    socket.on('send', function(data) {
        if (mate.isCommand(data.message))
            socket.emit('message', mate.receive(data.message));
        else
            io.sockets.emit('message', mate.receive(data.message));
    });
});

mate.bus.on('sendMove', function(data) {
    io.sockets.emit('message', data);
});