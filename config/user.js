var mongoose = require("mongoose");
module.exports = mongoose.model("User", {
    id : Number,
    username : String,
    passowrd : String,
    email : String,
    ratio : Number,
    score : Number,
    mod_Status : String,
    connected : Number
});