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
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var bcrypt = require('bcrypt-nodejs');
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
    password: String,
    socketId: Number,
    room: String,
    currentColor: Number
});
User = mongoose.model('User', userSchema);

function setUser(socket, username) {
    function updateUser(error, user) {
        console.log('Successfully set current user socket');
    }
    User.findOneAndUpdate({ username: username },
                          { socketId: socket.id },
                          updateUser);
}

function setUserColor(socket, color) {
    function updateUser(error, user) {
        console.log('Successfully set current user color');
    }
    User.findOneAndUpdate({ socketId: socket.id },
                          { currentColor: color },
                          updateUser);
}

function createUser(name, pw) {
    var salt = bcrypt.genSaltSync(10);
    var pass = bcrypt.hashSync(pw, salt);
    if (database._hasOpened) {
        var newUser = new User({
            username: name,
            password: pass,
            socketId: '',
            room: '',
            currentColor: ''
        });
        newUser.save(function(error) {
            if (error) {
                console.log(error);
                return;
            }
            console.log('Created user:');
            User.findOne({ username: name }, function(error, user) {
                console.log(error || user);
            });
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

// Catch user registration here
app.post('/register/submit', function(request, response) {
    if (request.body.name === '')
        // Flash that the username is empty
        response.redirect('/register');

    if (request.password === '')
        // Flash that the password is empty
        response.redirect('/register');

    User.findOne({ username: request.body.name }, function(error, user) {
        if (error) {
            console.log(error);
        }
        else if (user === null) {
            if (request.body.password === request.body.confirm) {
                createUser(request.body.name, request.body.password);
                request.session.username = request.body.name;

                response.redirect('/game');
            }
            else {
                // Flash that the passwords don't match
                response.redirect('/register');
            }
        }
        else {
            // Flash that the user exists
            response.redirect('/register');
        }
    });
});

// Catch user login here
app.post('/login/submit', function(request, response) {
    User.findOne({ username: request.body.name }, function(error, user) {
        if (error) {
            console.log(error);
        }
        else if (user === null) {
            // Flash that the user doesn't exist
            response.redirect('/login');
            return;
        }

        var correctPassword =
            bcrypt.compareSync(request.body.password, user.password);
        if (!correctPassword) {
            response.redirect('/login');
            return;
        }
        request.session.username = user.username;
        response.redirect('/game');
    });
});

app.get('/signout', function(request, response) {
        User.findOneAndUpdate({ username: request.body.name },
                              { socketId: '', currentColor: '', room: '' },
                              function(error, user) {
                                  console.log(user);
                                  request.session.destroy();
                                  response.redirect('/');
                              });
});

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
function cookieData(socket, next) {
    var data = socket.handshake || socket.request;
    var cookies = cookie.parse(data.headers.cookie);

    var sessionId =
        cookieParser.signedCookie(cookies[cookieName], cookieSecret);

    sessions.get(sessionId, function(error, session) {
        if (error)
            return console.log(error);
        if (! session)
            return console.log('session not found');

        next(session, socket);
    });
}

/* The chessmate setup goes here */
function room(roomName, whitePlayer) {
    this.roomName = roomName;
    this.playerCount = 1;
    this.game = new chessmate();
    this.board = this.game.createGame();
    this.colorTurn = 1;
    this.white = whitePlayer;
    this.blackPlayer;
    var that = this;

    this.game.on('sendMove', function(data) {
        console.log(data);
        that.board = that.game.display();
        gameRooms.to(that.roomName).emit('move', data);
        if (that.colorTurn === 1)
            that.colorTurn = 0;
        else
            that.colorTurn = 1;
    });
    this.game.on('sendError', function(data) {
        console.log(data);
        gameRooms.to(that.roomName).emit('error', data);
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
    this.username;
    var that = this;

    cookieData(socket, function(session, socket) {
        if (session.username === undefined)
            return;
        that.username = session.username;
    });

    // If someone is looking for a new game
    socket.on('newGame', function() {
        // Test if the user is an actual user (and not guest)
        if (that.username === undefined) {
            socket.emit('message', { message: 'You need to be logged in to '
                                            + 'do this.'});
            return;
        }
        // Go through all games and see if there is a game waiting for someone
        // to join, if there is, subscribe this socket
        for (var i = 0; i < games.length; i++) {
            if (games[i].playerCount < 2) {
                games[i].playerCount++;
                games[i].blackPlayer = socket.id;
                addSocketToRoom(socket, games[i].roomName);
                setUserColor(socket, 0);
                games[i].blackPlayer = that.username;
                socket.emit('board', { board: games[i].game.display() });

                var message = 'An opponent connected!';
                gameRooms.to(games[i].roomName)
                                         .emit('message', { message: message });
                gameRooms.to(games[i].roomName)
                                .emit('players', { black: games[i].blackPlayer,
                                                   white: games[i].whitePlayer }
                                                   );

                console.log('Joined game');
                return;
            }
        }

        // If all games are full, create a new game,
        // add a new player and subscribe the socket
        var name = 'game-standard-' + games.length;
        games.push(new room(name, that.username));
        addSocketToRoom(socket, name);
        setUserColor(socket, 1);
        socket.emit('board', { board: games[games.length - 1].game.display() });

        message = 'Please wait while we find an opponent :)';

        socket.emit('message', { message: message });

        console.log('Created game');
    });

    socket.on('send', function(data) {
        User.findOne({ socketId: socket.id }, function(error, user) {
            if (error || user === null) {
                console.error("Can't find user associated to socket.");
                return;
            }
            if (user.room === '')
                return;

            // Slightly ugly hack to find the game room element
            var room = games.filter(function(element) {
                return element.roomName === user.room;
            });
            var game = room[0].game;

            var message;
            // Check that two users are playing, if not, don't move
            console.log(game.playerCount);
            if (data.message.split(' ')[0] === '/move')
                if (room[0].playerCount < 2)
                    message = { message: 'Just a bit longer :)',
                                broadcast: false,
                                command: true };
                else if (room[0].colorTurn !== user.currentColor)
                    message = { message: 'Not your turn ;)',
                                broadcast: false,
                                command: true };
                else
                    message = game.receive(data.message + ' ' + user.currentColor);
            else
                message = game.receive(data.message + ' ' + user.currentColor);

            console.log(message);

            var sendData;
            if (message.command)
                sendData = { message: message.message };
            else
                sendData = { username: user.username,
                             message: message.message };

            if (message.broadcast)
                gameRooms.to(room[0].roomName).emit('message', sendData);
            else
                socket.emit('message', sendData);
        });
    });
});

/* The chessmate lobby */
var lobbyRooms = io.of('/lobbyRooms');
lobbyRooms.on('connection', function(socket) {
    cookieData(socket, function(session, socket) {
        if (session.username === undefined)
            return;
        User.findOne({ username: session.username }, function(error, user) {
            if (user.socketId === null)
                setUser(socket, session.username);
            else
                User.update({ username: session.username },
                            { socketId: socket.id },
                            function(error) {});
        });
    });
    socket.emit('welcome', 'Welcome to the server! Type /help for a list of ' +
                           'commands or /newGame to start a new game.');
    socket.on('send', function(data) {
        User.findOne({ socketId: socket.id }, function(error, user) {
            if (user === null) {
                socket.emit('message', { message: 'You need to be logged in to '
                                                + 'do this.'});
                return;
            }
            lobbyRooms.emit('message', { username: user.username,
                                         message: data.message });
        });
    });
    socket.on('disconnect', function() {
        User.findOneAndUpdate({ socketId: socket.id },
                              { socketId: '', currentColor: '', room: '' },
                              function(error, user) {
                                  console.log(user);
                              });
    });
});