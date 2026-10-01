const express = require('express')
const profileRouter = express.Router();
const { Admin } = require('../middlewares/auth')
const { validateEditProfileReq, ValidatePassword } = require('../utils/ValidateFields')
const validator = require('validator');
const bcrypt = require('bcryptjs')
const User = require('../models/user')
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
profileRouter.patch("/updatePassword",Admin, async (req, res) => {
    try {
        if (validator.isStrongPassword(req.body.newPwd)) {
            const secureUpdatePwd = await bcrypt.hash(req.body.newPwd, 10);
            await User.findByIdAndUpdate(req.user._id, { password: secureUpdatePwd })
            await res.cookie('token', null, {
                expires: new Date(Date.now())
            })
            res.send(`Updated new password for ${req.user.firstName} `)

        } else {
            throw new Error("Password Standard mismatch refer validator npm")
        }

    } catch (e) {
        res.status(400).send("Something went wrong" + e.message)
    }

})

module.exports = {
    ProfileRouter: profileRouter
}