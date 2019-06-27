var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    imagename: String,
    description: String,
    userid: String,
    // comments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "comment",
    //     require: "comment is required"
    // }]

});
module.exports = mongoose.model("imgpost", userSchema);