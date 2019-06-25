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
        usertype: user.usertype
    })
})

//for profile
app.post("/profile", function(req, res) {
    var user = new user({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        contact: req.body.contact,
        email: req.body.email
    });
})


app.listen(3000);