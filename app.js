var express = require('express');
var path = require('path');
// The port we are listening on
var port = '3501';
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var routes = require('./srv/routes/index');

var app = express();


// View engine setup
app.set('views', path.join(__dirname, 'srv/views'));
app.set('view engine', 'ejs');

/* Make all our additional middleware work */
// This is where the favicon needs to go
//app.use(favicon(__dirname + 'srv/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'srv/public')));
app.use(express.static(path.join(__dirname, 'srv/public')));
app.use(session({ secret: 'thisissome2l3mdssimbdlf'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

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

var io = require('socket.io').listen(app.listen(port));

io.sockets.on('connection', function(socket) {
    console.log('Test');
    socket.emit('message', { message: 'Test' });
});
