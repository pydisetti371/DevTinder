const express = require('express')
const app = express()
// we can send (req,res,next) with [] also
app.use(('/posts'), [(req, res, next) => {
    console.log("posts", req.query)
    // res.end("posts") // from here server will send res to the client it will close the tcp connection here if anything called bottom it may lead to error
    next()
}, (req, res, next) => {
    // res.end("posts1")
    next()
}, (req, res, next) => {
    res.end("post 12")
    // next()
}])





app.listen('8888', () => {
    console.log("server up")
})