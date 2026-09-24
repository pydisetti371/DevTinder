const express = require('express')
const app = express()

const cookieParser = require('cookie-parser')
const { connectDb } = require('./config/database')

app.use(express.json()) // middleware helps convert JSON body Object to JS object
app.use(cookieParser())

const { AuthRouter } = require('./routes/auth')
const { ProfileRouter } = require('./routes/profile')
const { RequestRouter } = require('./routes/request')
const  User  = require('./models/user')

app.use("/", AuthRouter)
app.use("/", ProfileRouter)
app.use("/", RequestRouter)

connectDb().then((res) => {
    console.log("Db connected successfully")
    app.listen('6666', () => {
        console.log("listening on 6666")
    })
}).catch(err => {
    console.log(err)
})


