const express = require('express')
const profileRouter = express.Router();
const { Admin } = require('../middlewares/auth')
const { validateEditProfileReq } = require('../utils/ValidateFields')


profileRouter.get('/profileview', Admin, async (req, res) => {
    try {
        const currentUser = req.user
        res.send(currentUser)

    } catch (e) {
        res.status(400).send("Something went wrong " + e.message)
    }
})

profileRouter.patch('/profileEdit', Admin, async (req, res) => {
    try {
        const currentUser = req.user
        if (validateEditProfileReq(req)) {
            Object.entries(req.body).forEach(([key, value]) => {
                currentUser[key] = value

            })
            await currentUser.save()
            res.json({ message: "Saved Successfully", updated: currentUser })
        } else {
            throw new Error("Not allowed to update")
        }

    } catch (e) {
        res.status(400).send("Something went wrong" + e.message)
    }
})

module.exports = {
    ProfileRouter: profileRouter
}