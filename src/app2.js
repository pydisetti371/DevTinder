const express = require('express')
const app = express()
const { Admin, User} = require("../middlewares/auth")
// we can send (req,res,next) with [] also
// app.use(('/posts'), [(req, res, next) => {
//     console.log("posts", req.query)
//     // res.end("posts") // from here server will send res to the client it will close the tcp connection here if anything called with res.end bottom it may lead to error
//     next()
// }, (req, res, next) => {
//     // res.end("posts1")
//     next()
// }, (req, res, next) => {
//     res.end("post 12")
//     // next()
// }])

app.use("/admin", Admin) // Admin Middleware to check whether it's verified profile or not Admin is not having res.send hence it will look next
app.get("/admin/login", (req, res, next) => {
    res.send('Admin logged In')
})

app.get("/admin/data",(req,res) => {
    console.log("admin data");
    res.send("Admin data fetched successfully")
})
app.use("/user", User)

app.get("/user",User, (req,res) => { // User middleware is not defined then it will skip checks what ever there in middleware
    // console.log(err,"err")
    res.send("user fetched successfully")
})
app.listen('8888', () => {
    console.log("server up -8888")
})