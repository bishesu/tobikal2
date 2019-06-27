var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    contact: String,
    email: String,
    username: String,
    description: String,


});
module.exports = mongoose.model("profile", userSchema);