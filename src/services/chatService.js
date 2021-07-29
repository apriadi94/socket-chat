const Models = require('../models')
// const userService = require('./userService')
const moment = require('moment');
const { Op } = require('sequelize');
const https = require('https')
moment.locale('id'); 

exports.countAllUnreadMessage =  async ( userId ) => {
  return new Promise(async resolve => {
    const allRoomByuserId = await Models.UserRoom.findAll({ raw: true, where: { userId } })
    let number = 0
    await Promise.all(
      allRoomByuserId.map(async item => {
        const countMessage = await Models.Message.count({
          where: {
            roomId: item.roomId,
            userId: {
              [Op.not]: userId
            },
            isRead: false
          }
        })
        number += countMessage
      })
    )
  
    resolve(number)
  })
}


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
            },
            isRead: false
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
                image: result.user.profilePicture,
                id: result.user.id
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

          const date = moment(lastMessage.createdAt).format('YYYY-MM-DD')

          var given = moment(date, "YYYY-MM-DD");
          var current = moment().startOf('day');

          const diffDaymoment = moment.duration(current.diff(given)).asDays()
          return {
            roomId: it.room.id,
            lastMessage: lastMessage.type === 'TEXT' ? lastMessage.content : 'Foto/File',
            isFromSelf: userId === lastMessage.userId ,
            isRead: lastMessage.isRead ,
            room: roomData,
            time: moment(lastMessage.createdAt).from(moment()),
            waktu: diffDaymoment === 0 ? moment(lastMessage.createdAt).format('LT') : diffDaymoment > 1 ? moment(lastMessage.createdAt).from(moment()) : moment(lastMessage.createdAt).format('DD/MM/YYYY'),
            unRead: await countUnreadMessage(it.room.id)
          };
        }),
      );

    return newData
}

exports.changeUnreadmessage = async (roomId, userId) => {
    await Models.Message.update({ isRead: true }, { 
      where: { 
        roomId,
        userId: { 
          [Op.not]: userId 
        }} 
    })
    return true
}

exports.getMessage = (roomId, userId) => {
      return new Promise(async resolve => {
        
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
                jam: moment(value.createdAt).from(moment()),
              };
            }),
          );
        })
        .catch(err => {
          throw err;
        });
        resolve(chat)
      })
}

exports.getRoomData = (to, userId) => {
  return new Promise(async resolve => {
    const dataUserRoom = await Models.UserRoom.findAll({
        where: { userId },
    }).catch(err => {
        throw err
    })

      const listRoom = []
      await Promise.all(
        await dataUserRoom.map(async item => {
          const searchRoomData = await Models.UserRoom.findOne({where : { userId: to[0].id, roomId: item.roomId }})
          if(searchRoomData){
            listRoom.push(searchRoomData)
          }
        })
      )
      if(listRoom.length > 0){
        resolve(listRoom[0].roomId)
      }else{
        resolve(null)
      }
  })
}

exports.getToUserByRoom = (userId, roomId) => {
  return new Promise(resolve => {
    Models.UserRoom.findOne({ 
      where: { 
        roomId,
        userId: { 
          [Op.not]: userId 
        }} 
     }).then(res => {
       resolve(res)
     })
  })
}


exports.storeMessage = async ({ userId, roomId, message, type, to, url, width, height }) => {
  return new Promise(async resolve => {
    if(roomId){
      await Models.Message.create({
        userId , roomId, content: message, type, isRead: false, url: `img/${url}`, width, height
      })
      await Models.UserRoom.update({ nowUpdate: moment().format('YYYY-MM-DD HH:mm:ss') }, { where: { roomId }})
      const allUserRoom = await Models.UserRoom.findAll({ where : { roomId }})
      allUserRoom.forEach(async item => {
        if(item.userId !== userId){
          // await kirimKePenerima(item.userId, userId, type, message)
        }
      });
      resolve(allUserRoom)
    }else{
      // to.forEach(async item => {
      //   await userService.addUser(item.id, { name: item.name, profilePicture: item.profilePicture })
      // })
      const room = await Models.Room.create({ type: 'PRIVATE', ownerId: userId })

      const bulkUserRoom = to.map(item => { return { userId: item.id, roomId: room.id }})

      await Models.UserRoom.bulkCreate([...bulkUserRoom, { userId, roomId: room.id }])
      await Models.Message.create({
        userId , roomId: room.id , content: message, type, isRead: false, url: `img/${url}`, width, height
      })
      bulkUserRoom.forEach(async item => {
        if(item.userId !== userId){
          // await kirimKePenerima(item.userId, userId, type, message)
        }
      });
      resolve([...bulkUserRoom, {userId, roomId: room.id}])
    }
  })
}


const kirimKePenerima = async (userId, pengirim, type, content) => {
  //kirim notif oneSignal

  const userData = await Models.User.findOne({ raw: true, where: { id: userId } })
  const pengirimData = await Models.User.findOne({ raw: true, where: { id: pengirim } })

  const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Basic ${process.env.ONE_SIGNAL_KEY}`
  };

  var data = {
      app_id: `${process.env.ONE_SIGNAL_APP}`,
      headings : {"en" : pengirimData.name},
      contents: {"en": type === 'TEXT' ? content : 'File/Foto'},
      channel_for_external_user_ids: "push",
      include_player_ids: [userData.tokenNotif]
  };

  const options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
  };


  const req = https.request(options, function(res) {
      res.on('data', function(data) {
          console.log("Response:");
          console.log(JSON.parse(data));
      });
  });

  req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
}

exports.tryToKirimManual = async (users, title, message, password) => {
    return new Promise(async (resolve, reject) => {
        if(password === process.env.NOTIF_PASSWORD){
            for(const user of users){
                await kirimKePenerimaManual(Number(user), title, message)
            }
            resolve('sukses')
        }else{
            reject('Password Salah')
        }
    })
    
}


const kirimKePenerimaManual = async (userId, title, message) => {
  //kirim notif oneSignal

  const userData = await Models.User.findOne({ raw: true, where: { id: userId } })
  await Models.Notif.create({ title, penerima: userData.name, message, tanggal: moment().format('YYYY-MM-DD') })

  const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `YzhiZTAwMDItMGU0MS00OTQ5LTgxMGUtNmVhNjI5MWZiODcw`
  };

  var data = {
      app_id: `19d6f466-2184-4bdd-a1fe-699f9dd00038`,
      headings : {"en" : title},
      contents: {"en": message },
      channel_for_external_user_ids: "push",
      include_player_ids: [userData.tokenNotif]
  };

  const options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
  };


  const req = https.request(options, function(res) {
      res.on('data', function(data) {
          console.log("Response:");
          console.log(JSON.parse(data));
      });
  });

  req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
}