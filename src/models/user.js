const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
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
        unique:true,
        required:true, // validation not working
        validate: (value) =>  {
            if(!validator.isEmail(value)) {
                throw new Error("Please enter proper email")
            }
        }
    },
    password: {
        type: String,
        minLength: 4,
        required:true,
        validate: (value) => {
            if(!validator.isStrongPassword(value)) {
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
            if(!validator.isURL(value)) {
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
},{
    timestamps:true
});

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel