var express = require('express');
var router = express.Router();
var fs = require('fs');

var server = require('mpdOnline');
var mpdOnline = new server;

/* GET home page. */
router.get('/', function(request, response, next) {
    console.log(request);
    //response.render('index', { title: 'Express' });
});

router.get('/player', function(request, response) {
    var pars = require('ua-parser').parse(request.headers['user-agent']);
    
    var isSupportedBrowser = !(pars.ua.family === 'Safari' ||
                               pars.ua.family === 'Mobile Safari' || 
                               pars.ua.family === 'Opera Mobile' ||
                               pars.ua.family === 'Chrome Mobile' ||
                               pars.ua.family === 'IE Mobile' ||
                               pars.ua.family === 'IE');

    response.render('player', { title: 'Music Player',
                                metadata: mpdOnline.metadata,
                                alert: isSupportedBrowser });
});

router.get('/player/metaStream', function(request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'retry':'5000'
    });

    var stream = new mpdOnline.metaStream(request, response);
    console.log(stream);
    stream.getCurrent(stream);
});

router.get('/index.php', function(request, response) {
    ip = request.headers;
    console.log(ip);

    fs.writeFile('/srv/node/checkIps',JSON.stringify(ip) + '\n', function(err) {
        if (err)
            console.log(err);
        else
            console.log('Another one found...');
    })
});

module.exports = router;
