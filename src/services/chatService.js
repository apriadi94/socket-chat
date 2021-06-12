const Models = require('../models')
const moment = require('moment');
const { Op } = require('sequelize');
moment.locale('id'); 

exports.roomConversation = async ( userId ) => {
    const countUnreadMessage = (roomId) => {
      return new Promise(resolve => {
        Models.Message.count({
          where: {
            roomId,
            userId: {
              [Op.not]: userId
            } 
          }
        }).then(result => {
          resolve(result)
        })
      })
    }

    const getRoomName = (roomId, roomType) => {
        return new Promise(resolve => {
          if(roomType === 'PRIVATE'){
            Models.UserRoom.findOne({
              include: ['user'],
              where: { 
                roomId, 
                userId: {
                  [Op.not]: userId
                } 
              }
             }).then(result => {
              resolve({
                name: result.user.name,
                image: result.user.profilePicture
              })
             })
          }else{
            resolve({
              name: 'Group Room',
              image: 'https://picsum.photos/id/35/200/300'
            })
          }
        })
    }

    const data = await Models.UserRoom.findAll({ 
        where: { userId },
        include: ['room', 'user']
    }).catch(err => {
        throw err
    })

    const newData = await Promise.all(
        data.map(async it => {
          const lastMessage = await it.getLastMessage({ order: [['createdAt', 'DESC']], limit: 1 })
          const room = await getRoomName(it.room.id, it.room.type)
          return {
            roomId: it.room.id,
            lastMessage: lastMessage.content,
            room: room,
            time: moment(lastMessage.createdAt).from(moment()),
            unRead: await countUnreadMessage(it.room.id)
          };
        }),
      );

    return newData
}