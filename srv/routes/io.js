var express = require('express.io');
var srv = require('chessmate/Comms');

function ioRoutes(app) {
    app.io.route('/special', function(request) {
        // Do something
    });
}

module.exports = function(app) {
    return new ioRoutes(app);
};