
module.exports = ({ socket }) => { 
    socket.on('HANGUP', async (to) => {
        socket.to(to).emit('HANGUP')
    })
}