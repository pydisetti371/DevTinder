const express = require('express');
const requestRouter = express.Router()
const { Admin } = require('../middlewares/auth')
requestRouter.get('/sendConnectionRequest', Admin, async (req, res) => {
    try {
        const getDetails = req.user
        res.send(`Connection req sent to ${getDetails.firstName} `)
    } catch (e) {
        res.status(400).send("Something went wrong " + e.message)
    }
})

module.exports = {
    RequestRouter: requestRouter
}