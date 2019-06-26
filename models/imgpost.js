var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    imagename: String,
    description: String,
    userid: String

});
module.exports = mongoose.model("imgpost", userSchema);