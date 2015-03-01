var mongoose = require("mongoose");
module.exports = mongoose.model("User", {
    Username : String,
    Passowrd : String
});