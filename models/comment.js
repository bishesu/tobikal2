const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comment_schema = new Schema({
    content: {
        type: String,
        require: "content is required"
    },
    imgpostid: {
        type: mongoose.Schema.ObjectId,
        ref: "imgpost", //same name from image post     
        required: "Post is required field"
    },
    user: {
        type: String
    }
});

Comment = mongoose.model('Comment', comment_schema);

module.exports = Comment;