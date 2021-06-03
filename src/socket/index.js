const { readdirSync } = require('fs')
const { resolve } = require('path')


module.exports = io => {
    io.on('connection', async socket => {
        socket.join('id')
        
        const listenersPath = resolve(`${__dirname}/listeners`);
        readdirSync(listenersPath)
        .filter(file => file.slice(-3) === '.js' && file !== 'index.js')
        .forEach(file => {
            require(resolve(listenersPath, file))({ socket });
        });
        
        socket.on("disconnect", () => console.log("user disconnected"));
    })
} 