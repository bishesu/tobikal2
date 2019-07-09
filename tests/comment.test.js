// use the path of your model 
const Comment = require('../models/comment');
const mongoose = require('mongoose');
// use the new name of the database 
const url = 'mongodb://localhost:27017/testing';
beforeAll(async() => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true
    });
});
afterAll(async() => {
    await mongoose.connection.close();
});
describe('Photogenie Comment backend Testing', () => {
    // the code below is for inserting user  
    var id = '';
    it('Comment', () => {
        const comment = {
            'user': 'raj lama',
            'imgpostid': '5d183c2d3ebf696d38386386 ',


        };
        return Comment.create(comment)
            .then((comment_res) => {
                id = comment_res._id;

                expect(comment_res.user).toEqual('raj lama');

            });
    });




});