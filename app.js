require('./database/connect');
const User = require('./models/user');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const auth = require('./middleware/auth');
app.use(express.static('./images'))
const ImgPost = require('./models/imgpost');

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

// LOGOUT
app.post("/profile/logout", auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//image upload
var storage = multer.diskStorage({
    destination: "images",
    filename: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        callback(null, file.fieldname + "-" + Date.now() + ext);
    }
});

var imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { return cb(newError("You can upload only image files!"), false); }
    cb(null, true);
};

var upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 1000000
    }
});

//image gate
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send({ Filename: req.file.filename });
    console.log(req.file.filename)
})

//post
app.post('/createpost', (req, res) => {
    var postData = new ImgPost(req.body);
    postData.save().then(function() {
        res.send('uploaded successfully');
    }).catch(function(e) {
        res.send(e)
    })
});

//current user
app.get('/user/auth', auth, function(req, res) {
    console.log(req.user);
    res.send(req.user);
})



app.listen(3000);