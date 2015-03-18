var express = require('express');
var path = require('path');
// The port we are listening on
var port = process.env.PORT ? process.env.PORT : '3000';
var favicon = require('serve-favicon');
var logger = require('morgan');
// var mongoose = require('mongoose');
// var user = mongoose.model("User");

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var passport = require('passport');
// var flash = require('connect-flash');
var session = require('express-session');
var chessmate = require('chessmate');

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
app.use(cookieParser('YOUwoNtevaaah6uess7H15'));
app.use(require('stylus').middleware(path.join(__dirname, 'srv/public')));
app.use(express.static(path.join(__dirname, 'srv/public')));

app.use(session({
    name: 'Chessmate_cookie',
    store: new session.MemoryStore(),
    secret: 'YOUwoNtevaaah6uess7H15',
    saveUninitialized: true,
    resave: true,
    cookie: {
        path: '/',
        httpOnly: true,
        // Set this to true if you have HTTPS
        secure: false,
        maxAge: null
    }
}));

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
io.set('log level', 2);

/* The chessmate setup goes here */

// var board;
io.sockets.on('connection', function(socket) {
//     if (board === undefined)
//         board = mate.createGame();
//     socket.emit('message', { board: board });
});

// mate.bus.on('sendMove', function(data) {
//     io.sockets.emit('message', data);
// });

function room(roomName, whitePlayer) {
    this.roomName = roomName;
    this.playerCount = 1;
    this.whitePlayer = whitePlayer;
    this.blackPlayer;
    this.game = new chessmate();
    this.board = this.game.createGame();

    this.game.bus.on('sendMove', function(data) {
        this.board = this.game.display();
        gameRooms.to(this.roomName).emit('board', { board: this.board });
    });
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
                games[i].blackPlayer = socket;
                socket.join(games[i].roomName);
                gameRooms.to(games[i].roomName)
                             .emit('board', { board: games[i].game.display() });

                console.log('Joined game');
                console.log(games[i].board);
                return;
            }
        }

        // If all games are full, create a new game,
        // add a new player and subscribe the socket
        var name = 'game-standard-' + games.length;
        games.push(new room(name, socket));
        socket.join(name);
        gameRooms.to(name)
                       .emit('board', { board: games[games.length - 1].board });

        var message = 'Please wait while we find an opponent :)';

        gameRooms.to(name).emit('message', { message: message });

        console.log('Created game');
        console.log(games[games.length - 1]);
    });

    socket.on('send', function(data) {
        if (socket.game.isCommand(data.message))
            socket.emit('message', socket.game.receive(data.message));
        else
            gameRooms.to(socket.game.roomName).emit
                                 ('message', socket.game.receive(data.message));
    });
});

/* The chessmate lobby */
var lobbyRooms = io.of('/lobbyRooms');
lobbyRooms.on('connection', function(socket) {
    socket.emit('welcome', 'Welcome to the server! Type /help for a list of ' +
                           'commands or /newGame to start a new game.');
    socket.on('send', function(data) {
        //if (mate.isLobbyCommand(data.message))
            //socket.emit('message', mate.lobbyReceive(data.message));
        //else
            lobbyRooms.emit('message', data);//mate.lobbyReceive(data.message));
    });
});