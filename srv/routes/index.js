var express = require('express');
var chat = require('chessmate/testChat');
var router = express.Router();
var lauren = require('chessmate/laurenTest');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

// GET test chat implementation
router.get('/testChat', function(request, response) {
    response.render('chat.ejs', { title: 'Hello World'});
});

// GET for the message distribution. Responds with a continuous stream that
//  contains all chat events.
router.get('/testChat/messageDistribute', function(request, response) {
    var id = chat.registerClient(request, response);

    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    response.write("retry: 5000\n");

    // Write first message manually
    response.write('id:' + id +'\n\n');
    response.write('data:I\'m a wizard, Hagrid!\n\n');
});

//If testChat receives a message send to all clients
router.post('/testChat', function(request, response) {
    chat.receive(request, response);
});

/*Most basic webapp implementation. Read all the code that is referenced within
  these if you need to learn*/

//Lauren's mongooseDB test implementation. Use this if you want to fiddle
router.get('/lauren', function(request, response) {
    response.render('lauren.ejs', { title: 'laurenTest' });
});

//Lauren's mongooseDB test webapp. Use this if you want to fiddle
router.post('/lauren', function(request, response) {
    var webapp = new lauren(request, response);

    webapp.respond();
});

lauren.connect('mongodb://localhost/test');
// Testing database running on localhost. Notify if error occurs
var db = lauren.connection();
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
    // It works
});

// A Schema is referenced here with one property, name, with type String
var userNameSchema = lauren.Schema({
    firstName: String,
    surname: String
});

// Compiling Schema into a model - class to construct documents. Each document
// is a Person with the one property of name. lauren.model(modelName, schema)
var Person = lauren.model('Person', userNameSchema);

// Creating a Person document
var barbara = new Person({ firstName: 'Barbara', surname: 'Lime'});
console.log(barbara.firstName);

// Adding a function to our documents
userNameSchema.methods.talk = function(){
    var saying = this.firstName
        ? "My name is " + this.firstName
        : "I don't have a first name";
    console.log(saying);
};

var bob = new Person({ firstName : 'Bob', surname: 'Robertson'});
bob.talk(); //My name is bob

// Creating a shortcut to write out first name followed by surname.
userNameSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.surname;
});
// Now when virtual property fullName is accessed, function gets invoked
console.log('bob.fullName is mental'); // Bob Robertson is mental

// Each document needs to be saed to mongoDB
bob.save(function (err, bob){
    if (err) return console.error(err);
    bob.speak();
});

// Access all Person documents through the Person model
Person.find(function (err, people){
    if (err) return console.error(err);
    console.log(people);
});

// Filter people by name. Below searches for names that start with B
//Person.find({ name: /^B/ }, callback);

module.exports = router;