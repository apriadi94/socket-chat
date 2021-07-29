
module.exports = ({ socket }) => { 
    socket.on('SEND_CALL', async ({to, user}) => {
        socket.to(to).emit('RECEIPT_CALL', user)
    })
}