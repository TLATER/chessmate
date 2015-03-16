var express = require('express');
var path = require('path');
// The port we are listening on
var port = process.env.PORT ? process.env.PORT : '3000';
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
// var user = mongoose.model("User");

var user = require("./config/user");
//var userSchema = mongoose.Schema;

var db = mongoose.connect('mongodb://localhost', function(){
    console.log("works!!");
    var connection = mongoose.connection;
    var user1 = new user();
    user1.username = "Alex";
    user1.save();
    console.log(user1);
    if(user.find({username : "Alex"}) !== undefined)
        console.log(user.username);
});

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

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

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

/* The chessmate setup goes here */

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

function room(roomName, playerCount) {
    this.roomName = roomName;
    this.playerCount = 0;
}

/* The chessmate games */
var games = [];
var gameRooms = io.of('/gameRooms');
gameRooms.on('connection', function(socket) {
     // If someone is looking for a new game
    socket.on('newGame', function() {

        // Go through all games and see if there is a game waiting for someone
        // to join, if there is, subscribe this socket
        for (var i = 0; i < games.length; i++) {
            if (games[i].playerCount < 2) {
                games[i].playerCount++;
                socket.join(games[i].roomName);
                return;
            }
        }

        // If all games are full, create a new game,
        // add a new player and subscribe the socket
        var name = 'game-standard-' + games.length;
        games.push(new room(name, 1));
        socket.join(name);
    });
});

/* The chessmate lobby */
var lobbyRooms = io.of('lobbyRooms');
lobbyRooms.on('connection', function(socket) {
    socket.emit('welcome', 'Welcome to the server! Type /help for a list of' +
                           'commands or /newGame to start a new game.');
    socket.on('send', function(data) {
        if (mate.isLobbyCommand(data.message))
            socket.emit('message', mate.lobbyReceive(data.message));
        else
            lobbyRooms.emit('message', data);//mate.lobbyReceive(data.message));
    });
});