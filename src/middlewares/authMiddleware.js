const crypto = require('crypto')

const randomId = () => crypto.randomBytes(8).toString('hex');

module.exports = io => {
  io.use((socket, next) => {
    // TOKEN CHECKING
    const token = socket.handshake.auth.token ?? socket.handshake.query.token;

    if (token !== process.env.APP_SOCKET_TOKEN){
      next(new Error('invalid username'))
    }else{
      // ATTACH SESSION ID IF NOT EXIST!
      const userId = socket.handshake.auth.userId ?? Number(socket.handshake.query.userId);
      const username = socket.handshake.auth.username ?? socket.handshake.query.username;
      const profileImage = socket.handshake.auth.profileImage ?? socket.handshake.query.profileImage;

      socket.sessionId = randomId();
      socket.userId = userId;
      socket.username = username;
      socket.profileImage = profileImage;
      next();
    }
  });
};
