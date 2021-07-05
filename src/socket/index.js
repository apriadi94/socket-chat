const { readdirSync } = require('fs')
const { resolve } = require('path')
const chatService = require('../services/chatService')


module.exports = io => {
    const userOnline = {}
    io.on('connection', async socket => {
        socket.join(socket.userId)

        userOnline[socket.userId] = socket.userId
        io.emit('USER_ONLINE', userOnline)

        const listenersPath = resolve(`${__dirname}/listeners`);
        readdirSync(listenersPath)
            .filter(file => file.slice(-3) === '.js' && file !== 'index.js')
            .forEach(file => {
                require(resolve(listenersPath, file))({ io, socket, chatService });
            });
        
        socket.on("disconnect", () => {
            delete userOnline[socket.userId]
            io.emit('USER_ONLINE', userOnline)
        });
    })
}