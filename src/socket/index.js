
module.exports = io => {
    io.on('connection', async socket => {
        socket.join('id')
        
        socket.on('REQUEST_CONVERSATION', () => {
            socket.emit('CONVERSATION_SENT', [{user : 1}, {user : 2}])
        })
        
        socket.on("disconnect", () => console.log("user disconnected", socket));
    })
} 