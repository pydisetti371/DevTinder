const express = require('express')
const app = express()
const User = require('./models/user')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { SignUpValidate } = require('./utils/SignUpValidate')
const { connectDb } = require('./config/database')
const { Admin } = require('./middlewares/auth')
connectDb().then((res) => {
    console.log("Db connected successfully", res)
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
        const isPasswordSame = await bcrypt.compare(password, userObj?.password);
        if (isPasswordSame) {
            const generateToken = jwt.sign({ _id: userObj._id }, 'Revanth@!371');
            res.cookie("token", generateToken)
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
app.get('/email', async (req, res) => {
    try {
        const userDetails = await User.find({ emailId: req.body.emailId }) // findOne return one object which was inserted 1st
        if (userDetails.length) {
            res.send(userDetails) // return array of objects
        } else {
            res.status(404).send([])
        }
    } catch (e) {
        res.status(400).send("Something went wrong")
    }
})

app.get('/allUsers', async (req, res) => {
    try {
        const allUsers = await User.find({})
        if (allUsers.length) {
            res.send(allUsers)
        } else {
            res.status(400).send("No records found")
        }
    } catch (e) {
        res.status(400).send("Something went wrong")
    }
})

app.get('/:id', async (req, res) => {
    try {
        const getUserDetailsById = await User.findById({ _id: req.params.id })
        console.log(getUserDetailsById)
        if (Object.keys(getUserDetailsById).length) {
            res.send(getUserDetailsById)
        } else {
            res.status(404).send("No user found")
        }
    } catch (e) {
        console.log(e, "67")
        res.status(400).send("Something went wrong" + e.message)
    }

})

app.delete("/user", async (req, res) => {
    // console.log(req.query)
    try {
        const deleteUser = await User.findByIdAndDelete(req.query.id); // for one Id
        // const deleteMultipleUsers = await User.deleteMany({
        //     _id: {\$in: idsToDelete } // implement later
        // })
        res.send("User deleted successfully")

    } catch (e) {
        res.status(400).send("Something went wrong")
    }
})

app.patch("/user", async (req, res) => {
    try {
        const ALLOWED_UPDATES = [
            "userId",
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
            "firstName",
            "lastName"
        ]
        const isUpdateAllowed = Object.keys(req.body).every(k => ALLOWED_UPDATES.includes(k))
        if (!isUpdateAllowed) {
            throw new Error("User update not allowed")
        }
        if (req.body.skills.length > 10) {
            throw new Error("Skills not be more than 10")
        }
        const updateUser = await User.findByIdAndUpdate(req.query.id, req.body) // use bulkWrite for to update each data for ids
        res.send("User Updated Successfully")

    } catch (e) {
        res.status(400).send("Something went wrong" + e.message)
    }
})

app.put("/user", async (req, res) => {
    try {
        const updateUser = await User.findOneAndReplace({ _id: req.query.id }, req.body)
        console.log(updateUser, "000")
        res.send("User Details Update SUccessfully")
    }
    catch (e) {
        console.log(e)
        res.status(400).send("Something went wrong")
    }
})


