var mongoose = require('mongoose');
var Schema = mongoose.Schema;

feedbackSchema = new Schema({
    feedback_id: Number,
    fullname: String,
    email: String,
    contact: String,
    description: String
});
Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;