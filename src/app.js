const express = require('express'); // this way of writing is called CommonJS module system. It is used in Node.js to import modules. The require function is used to load the express module and assign it to the variable express.
const app = express();
app.listen(7777, () => {
    console.log('Server is running on port 7777');
})
// app.use("/", (req, res, next) => { if we call any route then by default it will go to this route and send the response. This is called middleware instead log messages 
//     res.send("Request received at /");
//     next(); // this will call the next middleware in the stack. If we don't call next() then the request will be stuck here and will not go to the next middleware or route handler.
// })
app.get("/", (req, res,next) => {
    res.send("Running on Express");
    // next()
})
app.get("/greeting", (req, res) => {
    res.send("Hello, welcome to the greeting page!");
})
app.get('/helloexpress', (req, res) => {
    res.send("Hello, Express!");
})
app.get('/learn', (req, res) => {
    res.send("Learning Express is fun!");
})
app.get('/user-details', (req, res) => { // if req comes like /user-details/?name="Revanth" <- name can be accessed via req.query.name
    console.log(req.query.name, typeof(req.query.name),"params")
    let name = req.query.name
    name = name.replace(/^["']|["']$/g, "").trim(); // name will come as '"Revanth"'

    console.log(name,"255")
    if(name === "Revanth") {
        res.send({name:"Revanth",age:30})
    } else {
        console.log("24")

    res.send({ name: "John Doe", age: 30 })

    }
})

app.post("/user-details", (req, res) => {
    console.log("user-details post request received"); // db call
    res.send({ message: "User details received successfully" })
})

app.get('/user-details/:id/:name',(req,res) => { // IF req comes like /user-details/1/revanth
    const params = req.params
    console.log(params.id,params.name,"params")
    res.send(`Details with ${params.id}  ${params.name}`)
})

app.use('/hello', (req, res, next) => {
    console.log("1777777", req.query)
    res.end("Hello-18")
    // next()
})
app.use('/hello1/user12', (req, res) => {
    console.log("20000", req.query)
    res.end("Hello") //O/p -> "Hello", if url with "USE" /hello/user12  - O/p -> 'Hello-18', if we call /hello/user12 with "GET" also -o/p -> 'Hello-18'. to make independent call routes without .use
}) 
app.use('/greet', (req, res) => {
    console.log("2000022", req.query)
    res.end("greet")
})



// 1. Schedule a task to run the moment the main code block finishes
process.nextTick(() => {
    console.log(`Hello, ${userName}`);
});
Promise.resolve("Resoleved").then((value) => {
    console.log(value);
})

// 2. Assign the value down here
userName = "Alex";
console.log(global.userName)