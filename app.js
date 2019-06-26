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
const mongoose = require('mongoose');
const comment = mongoose.model("comment");

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

//deleting user post
app.delete('/createpost/:userpostdelete', async(req, res) => {
    try {
        const post = await post.findByIdAndRemove({
            _id: req.params.userpostdelete
        });
        res.send(post)
    } catch (error) {
        res.send(500)
    }
})

// create a comment
app.post(".imgpost/:id/comment", async(req, res) => { //imgpost/:id/comment pls chck
    //find a post    
    const imgpost = await imgpost.findone({ _id: req.params.id });
    //create a comment
    const comment = new comment();
    comment.content = req.body.content;
    comment.imgpost = imgpost._id;
    await comment.save();
    //associate post with comment
    imgpost.comment.push(comment._id);
    await imgpost.save();
    res.send(comment);
});

//read a comment



//feedback
var express = require('express');
var router = express.Router();
var Contact = require('../Model/contact');
var Feedback = require('../Model/feedback');


router.post('/contact', (req, res) => {
    // res.header("allow-file-access-from-files", "*");
    var contact = new Contact();

    contact.fname = req.body.fname;
    contact.lname = req.body.lname;
    contact.subject = req.body.subject;
    contact.email = req.body.email;
    contact.message = req.body.message;

    console.log(contact);
    contact.save((err, doc) => {
        if (err) {
            res.send({ 'Success': 'Something is wrong' });
        } else {
            res.send({ "Success": 'Your feedback successfully send. We will call you soon' });
        }
    });
});
router.post('/feedback', (req, res) => {
    // res.header("allow-file-access-from-files", "*");
    var feedback = new Feedback();

    feedback.name = req.body.name;
    feedback.contact = req.body.phone;
    feedback.email = req.body.email;
    feedback.message = req.body.message;


    console.log(feedback);
    feedback.save((err, doc) => {
        if (err) {
            res.send({ 'Success': 'Something is wrong' });
        } else {
            res.send({ "Success": 'Your feedback successfully send. We will call you soon' });
        }
    });
});




module.exports = router;




app.listen(3000);