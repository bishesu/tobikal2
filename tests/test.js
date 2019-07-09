// use the path of your model 
const User = require('../models/profile');
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

describe('Photogenie User Testing', () => {
    // the code below is for inserting user  
    var id = '';
    it('Add User', () => {
        const user = {
            'usertype': 'user',
            'firstname': 'Bishes',
            'lastname': 'test',
            'email': 'bishesu@gmail.com',
            'dateofbirth': '1998-03-18',
            'contact': '98565652132',
            'username': 'bishes',
            'password': 'bishes'

        };
        return User.create(user)
            .then((user_res) => {
                id = user_res._id;

                expect(user_res.firstname).toEqual('Bishes');

            });
    });

    // Update User

    it('updateuser testing', () => {
        const userupdate = {
            firstname: 'Bishes'
        }
        console.log(id)
        return User.findByIdAndUpdate(id, userupdate, {
            new: true
        }).then((userupdate) => {
            expect(userupdate.firstname).toEqual('Bishes');
        });
    });

    // User Delete Testing
    it('testing User Delete', async() => {
        const status = await
        User.deleteOne({
            usertype: 'user'
        });
        expect(status.ok).toBe(1);
    });
});