const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    dateofbirth: {
        type: String
    },
    contact: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    usertype: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]


})

//token generating part
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisloginuser')

    console.log(token);
    user.tokens = user.tokens.concat({ token: token })
    await user.save()
    return token;
}

//checking username and password 
userSchema.statics.checkCrediantialsDb = async(usern, pswd) => {
    const user1 = await User.findOne({ username: usern, password: pswd })
    return user1;
}
const User = mongoose.model('User', userSchema);
module.exports = User;