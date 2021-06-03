
module.exports = ({ socket }) => { 
    socket.on('REQUEST_CONVERSATION', () => {
        socket.emit('CONVERSATION_SENT', [{user : 1}, {user : 2}])
    })
}