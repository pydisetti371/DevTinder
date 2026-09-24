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


17/9 : Add api level validations for GET,POST,PUT 

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

/profile  - all info getting
/like
/pass
/imge upload 
