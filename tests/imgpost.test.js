// use the path of your model 
const Imagepost = require('../models/imgpost');
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
describe('Photogenie Image Post Testing', () => {
    // the code below is for inserting user  
    var id = '';
    it('Imagepost', () => {
        const imgpost = {
            'imagename': 'upload-1561869353451.jpg',
            'userid': '5d131c8d04d6d74040cff8f4',
            'description': 'bababa',


        };
        return Imagepost.create(imgpost)
            .then((imgpost_res) => {
                id = imgpost_res._id;

                expect(imgpost_res.userid).toEqual('5d131c8d04d6d74040cff8f4');

            });
    });




});