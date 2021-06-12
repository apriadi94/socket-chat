const Models = require('../models')
const moment = require('moment')
moment.locale('id'); 

exports.roomConversation = async ( userId ) => {
    const data = await Models.UserRoom.findAll({ 
        where: { userId },
        include: ['room', 'user']
    }).catch(err => {
        throw err
    })

    const newData = await Promise.all(
        data.map(async it => {
          const lastMessage = await it.getLastMessage({ order: [['createdAt', 'DESC']], limit: 1 })
          return {
            roomId: it.room.id,
            lastMessage: lastMessage.content,
            room: {
              name: it.user.name,
              image: it.user.profilePicture
            },
            time: moment(lastMessage.createdAt).from(moment())
          };
        }),
      );

    return newData
}