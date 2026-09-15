app.use -> used to register the middleware calls like -> Get, Post, Put, Update  
app.get -> used to call get methods both http requests or sending entire JSON to webpage

In app.use next() one is more crucical otherwise router will stay there only
app.use("/greeting",(req,res) => { 
    res.send("Hello, welcome to the greeting page!");
})
app.use('/greeting/1',(req,res) => { // this one also print Hello, welcome to the greeting page! becz .use will consider initial route here /greeting/1 also consider as /greeting if we keep /greeting12 on the above route /greeting12 it will directly point to that route. if /greeting and /greeting/1 here /greeting will take hence it will print 1st console
    res.send("Hello, Express!");
})
app.use('/learn',(req,res) => {
    res.send("Learning Express is fun!");
})
app.listen(7777,() => {
    console.log('Server is running on port 7777');
})
app.use("/",(req,res) => { // if we place on this top every route it will respond with Running on express why becz every route start with / then directly it will consider this route
    res.send("Running on Express");
})

in order to avoid mistakes from above -> use app.get

TODO: 
Explore routing and use of +, - , ?, **.. so on
use of regex in router


