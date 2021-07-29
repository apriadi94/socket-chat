const router = require('express').Router()
const userService = require('../services/userService')
const chatService = require('../services/chatService')
const notifService = require('../services/notifService')
const moment = require('moment')

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

router.route('/not-admin')
    .get(async (req, res) => {
        const contacts = await userService.getContactNotAdmin()
        const newData = contacts.map(value => {
            return {
                id: value.id,
                text: value.name
            }
        })
        res.send({
            data: newData
        })
    })
	
router.route('/kirim-notif')
    .get(async (req, res) => {
        const { page, search } = req.query
        let data = []

        if(search === '' || search === null || search === 'undefined'){
            data = await notifService.getDataNotif(Number(page))
        }else{
            data = await notifService.getDataNotifSearch(Number(page), search)
        }
        const newData = data.data.map(value => {
            return{
                ...value.dataValues,
                tglIndo: moment(value.tanggal).format('DD/MM/YYYY')
            }
        })

        const sendData = {
            jumlah: data.allData,
            data: newData
        }

        console.log(search)
        res.send(sendData)
    })

    .post(async (req, res) => {
        const { password, judul, pesan, penerimaValue } = req.body
        chatService.tryToKirimManual(penerimaValue, judul, pesan, password)
            .then(res => {
                res.send({
                    message : res
                })
            }).catch(err => {
                console.log(err)
                res.status(500).send({
                    message : err
                })
            })
        
    })
	
    

module.exports = router
