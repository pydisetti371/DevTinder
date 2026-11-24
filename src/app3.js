require('dotenv').config();

const express = require('express')
const app = express()
const cors = require('cors')
const { connectDb } = require('./config/database')
app.use(cors({
    origin: "http://localhost:5173", // Must match your exact frontend URL (cannot be '*')
    credentials: true
}));
const cookieParser = require('cookie-parser')


app.use(express.json()) // middleware helps convert JSON body Object to JS object
app.use(cookieParser())

const { AuthRouter } = require('./routes/auth')
const { ProfileRouter } = require('./routes/profile')
const { RequestRouter } = require('./routes/request')
const { UserRouter } = require('./routes/user')

app.use("/", AuthRouter)
app.use("/", ProfileRouter)
app.use("/", RequestRouter)
app.use("/", UserRouter)

connectDb().then((res) => {
    console.log("Db connected successfully")
    app.listen(process.env.PORT, () => {
        console.log("listening on 3001")
    })
}).catch(err => {
    console.log(err)
})
