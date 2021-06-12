const { readdirSync } = require('fs')
const { resolve } = require('path')
const chatService = require('../services/chatService')


module.exports = io => {
    io.on('connection', async socket => {
        socket.join(socket.userId)
        
        const listenersPath = resolve(`${__dirname}/listeners`);
        readdirSync(listenersPath)
            .filter(file => file.slice(-3) === '.js' && file !== 'index.js')
            .forEach(file => {
                require(resolve(listenersPath, file))({ socket, chatService });
            });
        
        socket.on("disconnect", () => console.log("user disconnected"));
    })
}