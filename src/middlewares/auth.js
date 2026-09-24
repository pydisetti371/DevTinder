const jwt = require('jsonwebtoken');
const User = require('../models/user')
const adminAuth = async (req, res, next) => {
    try {
        const jwtToken = req.cookies;
        const { token } = jwtToken;
        if (token && token !== 'j:null') {
            const decodedUser = await jwt.verify(token, 'Revanth@!371',); // gets mongodb user id
            const getUserDetails = await User.findById(decodedUser._id);
            req.user = getUserDetails
        } else {
            throw new Error("Requested user details(token) not found")
        }
        next()

    } catch (e) {
        res.status(400).send("Error  " + e.message)
    }


}

const userAuth = (err, req, res, next) => {
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