const express = require('express');
const requestRouter = express.Router()
const { Admin } = require('../middlewares/auth')
const UserModel = require('../models/user')
const ConnectionRequestModel = require('../models/connectionRequest')
requestRouter.post('/request/send/:status/:userId', Admin, async (req, res, next) => {
    try {
        const { status } = req.params
        let fromUserId = req.user._id
        let toUserId = req.params.userId
        const toUserDetails = await UserModel.findById(req.params.userId)
        const connectionStatus = ['ignored', 'interested']
        if (!connectionStatus.includes(status)) {
            res.status(404).send("Invalid status type")
            return
        }
        const isFromAndToUserExists = await ConnectionRequestModel.findOne({ fromUserId, toUserId })
        if (isFromAndToUserExists) {
            res.status(409).send("An active connection already exists between these two accounts.")
            return
        }
        const existingConnection = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if (existingConnection) {
            res.status(409).send("An active connection already exists between these two accounts.")
            return
        }
        const saveConnection = new ConnectionRequestModel({ fromUserId, toUserId, status, toUserName: toUserDetails.firstName, fromUserName: req.user.firstName })
        const saveData = await saveConnection.save()

        res.json({
            message: `${req.user.firstName} has ${status} to ${toUserDetails.firstName}`,
            saveData

        })
    } catch (e) {
        console.log(e)
        res.status(400).send("Something went wrong " + e.message)
    }
})

requestRouter.post('/request/review/:status/:userId', Admin, async (req, res) => {
    try {
        const { userId, status } = req.params;
        const loggedInUser = req.user;

        const statuses = ['accepted', 'rejected']
        if (!statuses.includes(status)) {
            return res.status(404).send("Invalid status type: must be accepted rejected")
        }
        const findMatchingRecord = await ConnectionRequestModel.findOne({
            _id: userId,
            toUserId: loggedInUser._id,
            status: 'interested'
        })
        if (!findMatchingRecord) {
            return res.status(404).send('No Record found')
        }
        findMatchingRecord.status = status
        const data = await findMatchingRecord.save()
        res.json({
            message: `Request updated successfully to ${status}`,
            data
        })

    } catch (e) {
        res.status(400).send("something went wrong" + e.message)
    }

})
module.exports = {
    RequestRouter: requestRouter
}



// fromUserID & toUserID if available in db don't allow to submit - done
// don't allow if from and to are having same ids
// if a connection is also viceversa don't accept - done

// Approve when these Match
//    1. it should have requestId 2.loggedIn user Id must be toUserId as toUser should accept 3. status must be Interested.
// then update status to Accepted.