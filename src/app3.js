const express = require('express')
const app = express()
const { connectDb } = require('./config/database')
const User = require('./models/user')

connectDb().then((res) => {
    console.log("Db connected successfully", res)
    app.listen('6666', () => {
        console.log("listening on 6666")
    })
}).catch(err => {
    console.log(err)
})
app.use(express.json()) // middleware helps convert JSON body Object to JS object
app.post('/signup', async (req, res) => {
    // const newUser = new user({
    //     firstName: 'Mahesh',
    //     lastName: 'Pydisetti',
    //     emailId: 'mahesh.pydisetti@gmail.com',
    //     password: 'mahesh123'
    // })
    const newUser = new User(req.body) // new is mandatory. -> means it will create a new instance
    try {
        await newUser.save() // insertMany for array of users
        res.send("New user saved successfully")
    } catch (e) {
        res.status(500).send("Error msg ", e)
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
        res.status(500).send("Something went wrong")
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
        res.status(500).send("Something went wrong")
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
    } catch(e) {
        console.log(e,"67")
        res.status(500).send("Something went wrong")
    }
   
})
