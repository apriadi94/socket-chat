const router = require('express').Router()

router.get('/', (req, res) => {
    res.json({
        socket : 'this socket still in development'
    }).status(200)
})

module.exports = router