const adminAuth = (req, res, next) => {
    let authToken = 'xyz'
    if (authToken === 'xyz') {
        next()
    } else {
        res.status(401).send("Access denied")
    }
    // res.send("Admin route triggered") // if we enable this req will stop here

}

const userAuth = (err,req, res, next) => {
    let authToken = 'xyz'
    if (authToken === 'xyz') {
        next()
    } else {
        res.status(401).send("Access denied")
    }
    // res.send("Admin route triggered")

}

module.exports = {
    Admin: adminAuth,
    User: userAuth
}