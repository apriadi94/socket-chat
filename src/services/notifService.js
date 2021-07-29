const Models = require('../models')
const { Op } = require('sequelize');

exports.getDataNotif = (page) => {
    return new Promise(async resolve => {

        const offset =  10 * (Number(page) - 1)
        const limit = Number(page) * 10
        
        const data = await Models.Notif.findAll({ 
            order: [
                ['id', 'DESC'],
            ],
            limit,
            offset
         })

         const allData = await Models.Notif.count()


        const resData = {
            data: data,
            allData
        }
        
        resolve(resData)
        
    })
}

exports.getDataNotifSearch = (page, search) => {
    return new Promise(async resolve => {

        const offset =  10 * (Number(page) - 1)
        const limit = Number(page) * 10
        
        const data = await Models.Notif.findAll({ 
            where: {
                penerima: {
                    [Op.like] : `%${search}%`
                }
            },
            order: [
                ['id', 'DESC'],
            ],
            limit,
            offset
         })

         const allData = await Models.Notif.count({
            where: {
                penerima: {
                    [Op.like] : `%${search}%`
                }
            },
         })


        const resData = {
            data: data,
            allData
        }
        
        resolve(resData)
        
    })
}