const mongoose = require("mongoose");

const comment_schema = new mongoose.Schema({
    content: {
        type: String,
        require: "content is required"
    },
    imgpost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "imgpost", //same name from image post     
        required: "Post is required field"
    }
});

module.exports = mongoose.model