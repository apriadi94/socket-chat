const Models = require('../models')
const moment = require('moment');
const { Op } = require('sequelize');
moment.locale('id'); 

exports.roomConversation = async ( userId ) => {
    const getLastMessage = (roomId) => {
      return new Promise(resolve => {
        Models.Message.findOne({ 
           where: { roomId },
           order: [['createdAt', 'DESC']], 
           limit: 1 
        }).then(result => {
          resolve(result)
        })
      })
    }
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
        include: ['room', 'user'],
        order: [['updatedAt', 'DESC']],
    }).catch(err => {
        throw err
    })

    const newData = await Promise.all(
        data.map(async it => {
          const lastMessage = await getLastMessage(it.room.id)
          const roomData = await getRoomName(it.room.id, it.room.type)
          return {
            roomId: it.room.id,
            lastMessage: lastMessage.content,
            room: roomData,
            time: moment(lastMessage.createdAt).from(moment()),
            unRead: await countUnreadMessage(it.room.id)
          };
        }),
      );

    return newData
}


exports.getMessage = async (roomId, userId) => {
      const chat = await Models.Message.findAll({
        where: { roomId },
        // order: [['createdAt', 'DESC']],
      }).then(result => {
        return Promise.all(
          result.map(async value => {
            return {
              ...value.get(),
              isFromSelf: userId === value.userId,
              tanggal: moment(value.updatedAt).format('YYYY-MM-DD'),
              jam: moment(value.updatedAt).format('HH:mm'),
            };
          }),
        );
      })
      .catch(err => {
        throw err;
      });

      return chat
}

exports.storeMessage = async ({ userId, roomId, message, type }) => {
  return new Promise(async resolve => {
    if(roomId){
      await Models.Message.create({
        userId , roomId, content: message, type, isRead: false
      })
      const allUserRoom = await Models.UserRoom.findAll({ where : { roomId }})
      resolve(allUserRoom)
    } 
  })
}