var lauren = require('mongodb');

lauren.connect('mongodb://www.tlater.net:3597/lauren');
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