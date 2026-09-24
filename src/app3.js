const express = require('express')
const app = express()
const User = require('./models/user')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const { SignUpValidate } = require('./utils/SignUpValidate')
const { connectDb } = require('./config/database')
const { Admin } = require('./middlewares/auth')
connectDb().then((res) => {
    console.log("Db connected successfully")
    app.listen('6666', () => {
        console.log("listening on 6666")
    })
}).catch(err => {
    console.log(err)
})
app.use(express.json()) // middleware helps convert JSON body Object to JS object
app.use(cookieParser())
app.post('/signup', async (req, res) => {
    // new is mandatory. -> means it will create a new instance
    try {
        SignUpValidate(req.body)
        const { firstName, lastName, emailId, password } = req.body
        const hashPassword = await bcrypt.hash(password, 10); // generating ranom id using bcrypt with salt (10) means difficulty level
        const emailInDB = await User.findOne({ emailId: emailId })
        if (emailInDB) {
            throw new Error("Email Already Exists, Please try with new one")
        } else {
            const newUser = new User({ firstName, lastName, emailId, password: hashPassword })
            await newUser.save() // insertMany for array of users
            res.send("New user saved successfully")
        }

    } catch (e) {
        // console.log(e)
        res.status(400).send("Error  " + e.message)
    }

})

app.post("/login", async (req, res) => {
    try {
        const body = req.body
        const { emailId, password } = body
        const userObj = await User.findOne({ emailId: emailId });
        if (!userObj) {
            throw new Error("Invalid Credentials")
        }
        const isPasswordSameInDb = await userObj.validatePassword(password)
        if (isPasswordSameInDb) {
            const generateToken = await userObj.generateToken(); 
            res.cookie("token", generateToken, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            })
            res.send("Login Credentials verified")
        } else {
            res.cookie('token', '');
            throw new Error("Invalid Credentials")

        }

    } catch (e) {
        res.status(400).send("Error  " + e.message)
    }
})
app.get('/profile', Admin, async (req, res) => {
    try {
        const getDetails = req.user
        res.send(getDetails)

    } catch (e) {

        res.status(400).send("Something went wrong " + e.message)
    }
})

app.get('/sendConnectionRequest', Admin, async (req, res) => {
    try {
        const getDetails = req.user
        res.send(`Connection req sent to ${getDetails.firstName} `)
    } catch (e) {
        res.status(400).send("Something went wrong " + e.message)
    }
})



