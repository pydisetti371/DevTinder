const express = require('express');
const app = express();
app.get("/",(req,res) => {
    res.send("Running on Express");
})
app.get("/greeting",(req,res) => {
    res.send("Hello, welcome to the greeting page!");
})
app.get('/helloexpress',(req,res) => {
    res.send("Hello, Express!");
})
app.get('/learn',(req,res) => {
    res.send("Learning Express is fun!");
})
app.listen(7777,() => {
    console.log('Server is running on port 7777');
})