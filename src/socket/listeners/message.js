
module.exports = ({ socket, chatService }) => { 
    socket.on('REQUEST_MESSAGE', async (roomId) => {
        const chatMessages = await chatService.getMessage(roomId, socket.userId)

        socket.emit('MESSAGE_SENT', chatMessages)
    })
}