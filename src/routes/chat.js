const router = require('express').Router()
const chatService = require('../services/chatService')

router.route('/:userId')
    .get(async (req, res) => {
        const { userId } = req.params
        const countUnreadMessage = await chatService.countAllUnreadMessage(userId)
        res.send({
            data: countUnreadMessage
        })
    })
    

module.exports = router
