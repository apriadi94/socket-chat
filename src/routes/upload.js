const router = require('express').Router()
const moment = require('moment')


router.route('/')
    .post(async (req, res) => {
        const file = req.files.image

        file.mv(`${__dirname}/../../upload/${moment().format('dd-MM-YYYY-hh-mm-ss')}_${file.name}`, err => {
            if (err) {
                console.log(err)
                res.send('There is error')
            } else {
                res.send({
                    data: `${moment().format('dd-MM-YYYY-hh-mm-ss')}_${file.name}`
                })
            }
        })
        
    })
    

module.exports = router
