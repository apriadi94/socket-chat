const router = require('express').Router()
const userService = require('../services/userService')

router.route('/')
    .get(async (req, res) => {
        const contacts = await userService.getContact()
        res.send({
            data: contacts
        })
    })
    .post(async (req, res) => {
        const { uid, name, profilePicture, tokenNotif = null } = req.body
        await userService.addNewUser(uid, { uid, name, profilePicture, tokenNotif })

        res.send({
            data: 'sukses'
        })
    })
    

module.exports = router
