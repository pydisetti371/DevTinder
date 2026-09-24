const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const userSchema = new Schema({
    firstName: {
        type: String,
        minLength: 4,
        maxLength: 20,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        minLength: 4,
        maxLength: 20,
        trim: true,
        required: true
    },
    emailId: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true, // validation not working
        validate: (value) => {
            if (!validator.isEmail(value)) {
                throw new Error("Please enter proper email")
            }
        }
    },
    password: {
        type: String,
        minLength: 4,
        required: true,
        validate: (value) => {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Please enter a strong password")
            }
        }
    },
    age: {
        type: Number,
        min: 20,
        max: 50
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', 'Others'],
            message: '{VALUE} is not a supported gender' // Custom error message
        }
    },
    photoUrl: {
        type: String,
        default: "https://unsplash.com/photos/a-bunch-of-balloons-that-are-shaped-like-email-7NT4EDSI5Ok",
        // required:false,
        validate: (value) => {
            if (!validator.isURL(value)) {
                throw new Error("Please add valida url ")
            }
        }

    },
    about: {
        type: String,
        default: "Welcome to devTinder"
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

userSchema.methods.generateToken = async function () {
    const userObj =  this
    const token = await jwt.sign({ _id: userObj._id }, 'Revanth@!371', { expiresIn: '7d' }) // 2nd one secret pwd

    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser){
    const userObj = this;
    const hashPassword = userObj.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, hashPassword);
    return isPasswordValid
}

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel