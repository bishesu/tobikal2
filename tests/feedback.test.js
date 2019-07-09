// use the path of your model 
const Feedback = require('../models/feedback');
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
describe('Photogenie Feedback Testing', () => {
    // the code below is for inserting user  
    var id = '';
    it('Feedback', () => {
        const feedback = {
            'fullname': 'bishes upadhyaya',
            'description': 'bla bla bla ',
            'email': 'bishesu@gmail.com',
            'contact': '98989898',

        };
        return Feedback.create(feedback)
            .then((feedback_res) => {
                id = feedback_res._id;

                expect(feedback_res.email).toEqual('bishesu@gmail.com');

            });
    });




});