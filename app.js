var express = require('express');
var path = require('path');
// The port we are listening on
var port = process.env.PORT ? process.env.PORT : '3000';
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');

var cookie = require('cookie');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var passport = require('passport');
// var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var chessmate = require('chessmate');

var database = mongoose.connection;
var User;
database.on('error', console.error);
// Use database._hasOpened to check if this is already available
database.on('open', function() {
    console.log('Successfully connected to mongodb');
});

// This is a synchronous function, so anything that follows will have the
// functions defined.
mongoose.connect('mongodb://localhost');

// The mongoDB schema used for chessmate users
var userSchema = new mongoose.Schema({
    username: String,
    socketId: Number,
    room: String
});
User = mongoose.model('User', userSchema);

function setUser(socket) {
    if (database._hasOpened) {
        var newUser = new User({
            username: 'Always',
            socketId: socket.id,
            room: ''
        });
        newUser.save(function(error) {
            if (error)
                console.log(error);
        });
    }
    else
        return false;
}

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

var cookieName = 'Chessmate_cookie';
var cookieSecret = 'YOUwoNtevaaah6uess7H15';
var sessions = new MongoStore({ url: 'mongodb://localhost' });

app.use(session({
    name: cookieName,
    store: sessions,
    secret: cookieSecret,
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

// Implementation based on cookie parsing function from
// https://github.com/adelura/socket.io-express-solution.git
function cookieData(socket) {

}

/* The chessmate setup goes here */
function room(roomName, whitePlayer) {
    this.roomName = roomName;
    this.playerCount = 1;
    this.whitePlayer = whitePlayer;
    this.blackPlayer;
    this.game = new chessmate();
    this.board = this.game.createGame();
    var that = this;

    this.game.bus.on('sendMove', function(data) {
        that.board = that.game.display();
        gameRooms.to(that.roomName).emit('board', { board: this.board });
    });
}

// Add the user associated with a socket to a game room
function addSocketToRoom(socket, roomName) {
    // Callback for findOneAndUpdate
    function updateUser(error, user) {
        console.log('Successfully added user to room');
    }

    User.findOneAndUpdate({ socketId: socket.id },
                          { room: roomName },
                          updateUser);
    socket.join(roomName);
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
                games[i].blackPlayer = socket.id;
                addSocketToRoom(socket, games[i].roomName);
                gameRooms.to(games[i].roomName)
                             .emit('board', { board: games[i].game.display() });

                var message = 'An opponent connected!';
                gameRooms.to(name).emit('message', { message: message });

                console.log('Joined game');
                console.log(games[i].board);
                return;
            }
        }

        // If all games are full, create a new game,
        // add a new player and subscribe the socket
        var name = 'game-standard-' + games.length;
        games.push(new room(name, socket.id));
        addSocketToRoom(socket, name);
        gameRooms.to(name)
                       .emit('board', { board: games[games.length - 1].board });

        var message = 'Please wait while we find an opponent :)';

        gameRooms.to(name).emit('message', { message: message });

        console.log('Created game');
        console.log(games[games.length - 1].board);
    });

    socket.on('send', function(data) {
        User.findOne({ socketId: socket.id }, function(error, user) {
            if (error) {
                console.error("Can't find user associated to socket.");
                return;
            }
            console.log(games);

            // Slightly ugly hack to find the game room element
            var room = games.filter(function(element) {
                return element.roomName === user.room;
            });
            var game = room[0].game;

            if (game.isCommand(data.message))
                socket.emit('message', game.receive(data.message));
            else
                gameRooms.to(room[0].roomName).emit
                                        ('message', game.receive(data.message));
        });
    });
});

/* The chessmate lobby */
var lobbyRooms = io.of('/lobbyRooms');
lobbyRooms.on('connection', function(socket) {
    setUser(socket);
    socket.emit('welcome', 'Welcome to the server! Type /help for a list of ' +
                           'commands or /newGame to start a new game.');
    socket.on('send', function(data) {
        User.findOne({ socketId: socket.id }, function(error, user) {
            console.log(error || user);
        });
        //if (mate.isLobbyCommand(data.message))
            //socket.emit('message', mate.lobbyReceive(data.message));
        //else
            lobbyRooms.emit('message', data);//mate.lobbyReceive(data.message));
    });
});