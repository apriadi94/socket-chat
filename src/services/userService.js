const Models = require('../models')
const { logger } = require('../utils/logger')

exports.getContact = () => {
    return new Promise(resolve => {
        Models.User.findAll().then(res => {
            resolve(res)
        })
    })
}

exports.addUser = async (id, body) => {
    const checkUser = await Models.User.count({ where: { id } })
    if(checkUser === 0){
        await Models.User.create(body).catch(err => {
            logger.error(err)
        })
    }
}


exports.addNewUser = async (uid, body) => {
    const checkUser = await Models.User.count({ where: { uid } })
    if(checkUser === 0){
        await Models.User.create(body).catch(err => {
            logger.error(err)
        })
    }
}