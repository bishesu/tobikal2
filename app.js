require('./database/connect');
const User = require('./models/user');
const Feedback = require('./models/feedback');
const Comment = require('./models/comment');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const async = require('async');
const jwt = require('jsonwebtoken');
const path = require('path');
const auth = require('./middleware/auth');
app.use(express.static('./images'))
const ImgPost = require('./models/imgpost');
// const mongoose = require('mongoose');

app.use(cors());
app.use(express.static("./images"));

app.use("/images", express.static('images'))

app.use(bodyParser.urlencoded({ extended: false }));
app.post("/feedback", (req, res) => {
    console.log(req.body)
    var myData = new Feedback(req.body);
    myData.save().then(function() {
        res.send(' Contact successfully');

    }).catch(function(e) {
        res.send(e)
    });
});
//register
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
    console.log("i am hehe")
    const user = await User.checkCrediantialsDb(req.body.username, req.body.password);

    console.log(user);
    const token = await user.generateAuthToken();
    console.log(token)
    console.log(user);
    res.send({
        token: token,
        username: user.username,
        usertype: user.usertype,
        id: user._id
    })
})

//for profile
app.get("/profile", auth, function(req, res) {
    // User.findById(req.params.userId).then(function(loggedInUser) {
    //     res.json(loggedInUser);
    // })
    res.json(req.user);
})

//for updating user profile
app.put("/updateprofile/:userId", auth, function(req, res) {
    console.log(req.body)
    const userId = req.params.userId;
    const { username, firstname, lastname, contact, description, profilepicture } = req.body;
    User.findOneAndUpdate({ _id: userId }, { username, firstname, lastname, contact, description, profilepicture }, { new: true }).then(function(updateduser) {
        res.send("user updated successfully");
    }).catch(function(e) {
        res.send(e)
    })
})

// LOGOUT
app.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
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
        fileSize: 10000000000
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
    console.log(req.body)
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

app.get('/get_individual_user_image/:userid', function(req, res) {
    // console.log("bises");
    // console.log(req.params.userid);
    userid = req.params.userid;
    ImgPost.find({ userid: userid }).then(function(userData) {
        res.send(userData);
        console.log(userData)
    }).catch(function() {
        console.log('error')
    })
})

// for home page image
app.get('/get_all_user_image', function(req, res) {

    ImgPost.find({}).then(function(userData) {
        console.log(userData)
        res.send(userData)

    }).catch(function() {
        console.log('error')
    })
})

//image id for posting
app.get('/get_individual_image/:id', function(req, res) {
        var imageid = req.params.id;
        ImgPost.findById(imageid).then(function(userData) {
            console.log(userData)
            res.send(userData)

        }).catch(function() {
            console.log('error')
        })
    })
    //admin view users
app.get('/get_all_users', function(req, res) {
        User.find().then(function(Userdata) {
            res.send(Userdata)
        }).catch(function() {

        })
    })
    //admi feedback
app.get('/get_all_feedback', function(req, res) {
    Feedback.find().then(function(feedback) {
        res.send(feedback)
    }).catch(function() {

    })
})



//admin delete
app.delete('/delete_user/:id', function(req, res) {
        var userid = req.params.id
        User.findByIdAndDelete(userid).then(function() {
            console.log('deleted')
        }).catch(function() {
            console.log('failed')
        })
    })
    //user feedback delete by admin
app.post('/deletefeedback', function(req, res) {
    Feedback.findByIdAndRemove(req.body._id).then(feedback => {
        console.log(feedback);
        res.json(feedback);
    }).catch(function() {
        console.log('failed')
    })
})



//comment
app.get('/imgpostdetail/:id', (req, res) => {
    var locals = {};
    async.parallel([
        //Load user Data
        function(callback) {
            ImgPost.findById(req.params.id, function(err, imgpost) {
                if (err) return callback(err);
                locals.imgpost = imgpost;
                callback();
            });
        },
        //Load posts Data
        function(callback) {
            Comment.find({ imgpostid: req.params.id }, function(err, comments) {
                if (err) return callback(err);
                locals.comments = comments;
                console.log(comments);
                callback();
            }).sort({ '_id': -1 });
        }
    ], function(err) {
        if (err) return next(err);

        res.json({
            imgpost: locals.imgpost,
            comments: locals.comments,
        });
    });
    console.log(locals.comments);

});



//read a comment



//feedback
// var express = require('express');

// var router = express.Router();
// var Contact = require('../Model/contact');
// var Feedback = require('../Model/feedback');


// router.post('/contact', (req, res) => {
//     // res.header("allow-file-access-from-files", "*");
//     var contact = new Contact();

//     contact.fname = req.body.fname;
//     contact.lname = req.body.lname;
//     contact.subject = req.body.subject;
//     contact.email = req.body.email;
//     contact.message = req.body.message;

//     console.log(contact);
//     contact.save((err, doc) => {
//         if (err) {
//             res.send({ 'Success': 'Something is wrong' });
//         } else {
//             res.send({ "Success": 'Your feedback successfully send. We will call you soon' });
//         }
//     });
// });
// app.post("/contact", (req, res) => {
//     console.log(req.body)
//     var myData = new Contact(req.body);
//     myData.save().then(function() {
//         res.send(' Contact successfully');

//     }).catch(function(e) {
//         res.send(e)
//     });
// });


app.post('/feedback', (req, res) => {
    // res.header("allow-file-access-from-files", "*");
    var feedback = new Feedback();

    feedback.fullname = req.body.fullname;
    feedback.contact = req.body.phone;
    feedback.email = req.body.email;
    feedback.description = req.body.description;


    console.log(feedback);
    feedback.save((err, doc) => {
        if (err) {
            res.send({ 'Success': 'Something is wrong' });
        } else {
            res.send({ "Success": 'Your feedback successfully send. We will call you soon' });
        }
    });
});

app.post('/feedback', (req, res) => {
    // res.header("allow-file-access-from-files", "*");
    var feedback = new Feedback();

    feedback.fullname = req.body.fullname;
    feedback.contact = req.body.phone;
    feedback.email = req.body.email;
    feedback.description = req.body.description;


    console.log(feedback);
    feedback.save((err, doc) => {
        if (err) {
            res.send({ 'Success': 'Something is wrong' });
        } else {
            res.send({ "Success": 'Your feedback successfully send. We will call you soon' });
        }
    });
});

app.post('/comment', (req, res) => {

    var comment = new Comment();

    comment.user = req.body.user;
    comment.content = req.body.content;
    comment.imgpostid = req.body.imgpostid;
    console.log(comment);
    comment.save((err, doc) => {
        if (err) {
            res.send({ 'Success': 'Something is wrong' });
        } else {
            res.send({ "Success": 'Your feedback successfully send. We will call you soon' });
        }
    });
});


// module.exports = router;

//admin data nadhekhauna

app.get('/get_all_users', function(req, res) {
    User.find({ usertype: "user" }).then(function(user) {
            res.send(user);
        })
        .catch(function(e) {
            res.send(e)
        });
})


app.listen(3000);