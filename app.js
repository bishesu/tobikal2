require('./database/connect');
const User = require('./models/user');
const Feedback = require('./models/feedback');
const imgpost = require('./models/imgpost');
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
        res.json(' Contact successfully');

    }).catch(function(e) {
        res.json(e)
    });
});
//register
app.post("/register", (req, res) => {
    console.log("i am at register")
    console.log(req.body)
    var myData = new User(req.body);
    myData.save().then(function() {
        res.json('User registered successfully');
    }).catch(function(e) {
        res.json(e)
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
    res.json({
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
app.put("/updateprofile", auth, function(req, res) {

    const { username, firstname, lastname, contact, description, profilepicture } = req.body;
    User.findOneAndUpdate({ _id: req.user._id }, { username, firstname, lastname, contact, description, profilepicture }, { new: true }).then(function(updateduser) {
        res.json("user updated successfully");
    }).catch(function(e) {
        res.json(e)
    })
})


//upadting image description
app.put("/updateimagedesc/:id", auth, function(req, res) {
    var imageId = req.params.id;
    ImgPost.findByIdAndUpdate({ _id: imageId }, { $set: { description: req.body.description } }).then(function(updatedimage) {
        res.json("image updated successfully");
    }).catch(function(e) {
        res.json(e)
    })
})


// LOGOUT
app.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.json()
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
    res.json({ Filename: req.file.filename });
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
    res.json(req.user);
})

//deleting user post
app.delete('/createpost/:userpostdelete', async(req, res) => {
    try {
        const post = await post.findByIdAndRemove({
            _id: req.params.userpostdelete
        });
        res.json(post)
    } catch (error) {
        res.json(500)
    }
})

app.get('/get_individual_user_image', auth, function(req, res) {
    userid = req.user._id
    ImgPost.find({ userid: userid }).then(function(userData) {
        res.json(userData);
        console.log(userData)
    }).catch(function() {
        console.log('error')
    })
})
app.get('/get_individual_user_image_android/:id', function(req, res) {
    // userid = req.user.id
    ImgPost.find({ id: req.param.userid }).then(function(userData) {
        res.json(userData);
        console.log(userData)
    }).catch(function() {
        console.log('error')
    })
})


//for single image
app.get('/get_individual_image/:id', auth, function(req, res) {

        id = req.params.id
        ImgPost.find({ _id: id }).then(function(userData) {
            res.json(userData);
            // console.log(userData)
        }).catch(function() {
            console.log('error')
        })
    })
    // for home page image
app.get('/get_all_user_image', function(req, res) {

        ImgPost.find({}).then(function(userData) {
            console.log(userData)
            res.json(userData)

        }).catch(function() {
            console.log('error')
        })
    })
    //for deleting image
app.delete('/delete_individual_image/:id', auth, function(req, res) {
        var id = req.params.id
        ImgPost.findByIdAndDelete(id).then(function() {
            console.log('deleted')
        }).catch(function() {
            console.log('failed')
        })
    })
    //image id for posting
app.get('/get_individual_image/:id', function(req, res) {
        var imageid = req.params.id;
        console.log('i am here')
        console.log(imageid)
        ImgPost.findById(imageid).then(function(userData) {
            console.log(userData)
            res.json(userData)

        }).catch(function() {
            console.log('error')
        })
    })
    //admin view users
app.get('/get_all_users', function(req, res) {
        User.find().then(function(Userdata) {
            res.json(Userdata)
        }).catch(function() {

        })
    })
    //admi feedback
app.get('/get_all_feedback', function(req, res) {
    Feedback.find().then(function(feedback) {
        res.json(feedback)
    }).catch(function() {

    })
})

//admin view all user post
app.get('/get_all_image', function(req, res) {
    imgpost.find().then(function(imagedata) {
        res.json(imagedata)
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
app.delete('/deletefeedback/:id', function(req, res) {
        console.log(req.params.id)
        Feedback.findByIdAndDelete(req.params.id).then(feedback => {
            console.log(feedback);
            res.json(feedback);
        }).catch(function() {
            console.log('failed')
        })
    })
    //user post delete by admin
app.delete('/deletepost/:id', function(req, res) {
    console.log(req.params.id)
    ImgPost.findByIdAndDelete(req.params.id).then(imgpost => {
        console.log(imgpost);
        res.json(imgpost);
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



// app.post('/feedback', (req, res) => {
//     // res.header("allow-file-access-from-files", "*");
//     var feedback = new Feedback();

//     feedback.fullname = req.body.fullname;
//     feedback.contact = req.body.phone;
//     feedback.email = req.body.email;
//     feedback.description = req.body.description;


//     console.log(feedback);
//     feedback.save((err, doc) => {
//         if (err) {
//             res.json('Something is wrong');
//         } else {
//             res.json({ "Success": 'Your feedback successfully send. We will call you soon' });
//         }
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
            res.json('Something is wrong');
        } else {
            res.json({ "Success": 'Your feedback successfully send. We will call you soon' });
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
            res.json({ 'Success': 'Something is wrong' });
        } else {
            res.json({ "Success": 'Your feedback successfully send. We will call you soon' });
        }
    });
});


// module.exports = router;

//admin data nadhekhauna

app.get('/get_all_users', function(req, res) {
    User.find({ usertype: "user" }).then(function(user) {
            res.json(user);
        })
        .catch(function(e) {
            res.json(e)
        });
})

// post count 


app.listen(3000);