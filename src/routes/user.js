const express = require('express')
const { Admin } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const userRouter = express.Router()

userRouter.get("/user/requests/received", Admin, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate(
            'fromUserId',
            'firstName lastName' // fromUserId, key name in model there we defined with ref :User,  we can see fromUserId object details from User model
        )
        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })
    } catch (e) {
        res.send(400).send(`something went wrong ${e.message}`)
    }
})

userRouter.get('/user/connections', Admin, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const findAcceptedConnections = await ConnectionRequestModel.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate(
            'fromUserId'
        )
        const data = findAcceptedConnections.map((item) => {
            if (item.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return item.toUserId
            }
            return item.fromUserId
        })
        res.json({
            message: 'accepted connections fetched',
            data
        })
    } catch (e) {
        res.status(400).send('something went wrong ' + e.message)
    }
})

userRouter.get("/feed", Admin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit

        const skip = (page - 1) * limit;

        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id, toUserId: loggedInUser._id }]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } }, // $nin -> not include
                { _id: { $ne: loggedInUser._id } } // $ne -> not equal
            ]
        }).select("firstName lastName age skills").skip(skip).limit(limit);
        res.json({
            message: 'Data fetched successfully',
            data: users
        })
    } catch (e) {
        res.status(400).send('something went wrong' + e.message)
    }
})

module.exports = {
    UserRouter: userRouter
}