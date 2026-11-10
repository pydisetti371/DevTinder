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

userRouter.get('/user/connections',Admin,async (req,res) => {
     try {
         const loggedInUser = req.user;
         const findAcceptedConnections = await ConnectionRequestModel.find({
            $or: [
               { fromUserId: loggedInUser._id, status: 'accepted'},
               { toUserId: loggedInUser._id, status:"accepted"}
            ]
         }).populate(
            'fromUserId'
         )
         const data = findAcceptedConnections.map((item)=> {
            if(item.fromUserId._id.toString() === loggedInUser._id.toString()){
                return item.toUserId
            }
            return item.fromUserId
         })
         res.json({
            message:'accepted connections fetched',
            data
         })
     } catch (e) {
       res.status(400).send('something went wrong ' + e.message)
     }
})

module.exports = {
    UserRouter: userRouter
}