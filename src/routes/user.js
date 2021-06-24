const router = require('express').Router()
const userService = require('../services/userService')

router.route('')
    .get(async (req, res) => {
        const contacts = await userService.getContact()
        res.send({
            data: contacts
        })
    })
    .post(async (req, res) => {
        const { uid, name, profilePicture, tokenNotif = null } = req.body
        const user = await userService.addNewUser(uid, { uid, name, profilePicture, tokenNotif })
        let dataUser;

        if(user){
            dataUser = user
        }else{
            const getUser = await userService.getUserByUid(uid)
            dataUser = getUser
        }

        res.send({
            data: dataUser
        })
    })
    

module.exports = router
