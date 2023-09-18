const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //for decrypting
const jwt = require('jsonwebtoken');
const SALT = 10;

const user = new mongoose.Schema({
    password: {
        type: String,
        required: [true, 'The password field is required!'],
        minlength: 5
    },
    name: {
        type: String,
        required: [true, 'The name field is required!'],
        trim: true,
        maxlength: 100,
        unique: true
    },
    files: {
        type: Array,
    },
    token: {
        type: String
    },
}, { minimize: false });


// ? // ? //
//saving user data
user.pre('save', function(next) { // ? next means
    var user = this;
    if (user.isModified('password')) { //checking if password field is available and modified
        bcrypt.genSalt(SALT, function(err, salt) {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err)
                user.password = hash;
                next(); //calling save function
            });
        });
    } else {
        next();
    }
});
//for comparing the users entered password with database duing login 
user.methods.comparePassword = function(candidatePassword, callBack) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return callBack(err);
            callBack(null, isMatch);
        });
    }
    //for generating token when loggedin
user.methods.generateToken = function(callBack) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), process.env.SECRETE);
    user.token = token;
    user.save(function(err, user) {
        if (err) return callBack(err)
        callBack(null, user)
    });
};
//validating token for auth routes middleware
user.statics.findByToken = function(token, callBack) {
    var user = this;
    jwt.verify(token, process.env.SECRETE, function(err, decode) { //this decode must give user_id if token is valid .ie decode=user_id
        user.findOne({ "_id": decode, "token": token }, function(err, user) {
            if (err) return callBack(err);
            callBack(null, user);
        });
    });
};
// const User = mongoose.model('user', user);
module.exports = User = mongoose.model('user', user);