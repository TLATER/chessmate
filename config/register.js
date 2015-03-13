var LocalStrategy   = require('passport-local').Strategy;
var User = require('./user');
var bCrypt = require('bcrypt-nodejs');
var mongoose = require("mongoose");
var conn = mongoose.connection;
module.exports = function(passport) {

	passport.use('register', new LocalStrategy(
        function(req, username, password, done) {
            console.log('test');

           var findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+ username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();

                        // set the user's local credentials
                        newUser.username = username;
                        newUser.password = encrypt(password);
                        newUser.ratio = 0;
                        newUser.score = 0;
                        newUser.mod_Status = "";

                        // save the user
                        conn.collection("User").insert(newUser);
                            console.log('User Registration succesful');
                            return done(null, newUser);
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var encrypt = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}