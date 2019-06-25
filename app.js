require('./database/connect');
const User = require('./models/user');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.post("/register", (req, res) => {
    console.log(req.body)
    var myData = new User(req.body);
    myData.save().then(function() {
        res.send('User registered successfully');

    }).catch(function(e) {
        res.send(e)
    });
});

// for login

app.post("/login", async function(req, res) {
    const user = await User.checkCrediantialsDb(req.body.username, req.body.password);

    const token = await user.generateAuthToken();
    console.log(token)
        // console.log(user);
    res.send({
        token: token,
        usertype: user.usertype,
        id: user._id
    })
})

//for profile
app.get("/profile/:userId", function(req, res) {
    User.findById(req.params.userId).then(function(loggedInUser) {
        res.json(loggedInUser);
    })
})

//for updating user profile
app.put("/updateprofile/:userId", function(req, res) {
    console.log(req.body)
    const userId = req.params.userId;
    const { username, firstname, lastname, contact, description } = req.body;
    User.findOneAndUpdate({ _id: userId }, { username, firstname, lastname, contact, description }, { new: true }).then(function(updateduser) {
        res.send("user updated successfully");
    }).catch(function(e) {
        res.send(e)
    })
})


app.listen(3000);