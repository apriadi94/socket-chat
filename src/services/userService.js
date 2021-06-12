const Models = require('../models')
const logger = require('../utils/logger')

exports.addUser = async (id, body) => {
    const checkUser = await Models.User.count({ where: { id } })
    if(checkUser === 0){
        await Models.User.create(body).catch(err => {
            console.log(err)
            logger.error(err)
        })
    }
}