
module.exports = ({ io, socket, chatService }) => { 
    socket.on('STORE_MESSAGE_CHAT', async ({ roomId, message, type }) => {
        const userId = socket.userId
        const storeMessage = await chatService.storeMessage({ userId, roomId, message, type })
        const receipt = storeMessage.map(item => item.id)

        receipt.forEach(async item => {
            const chatMessages = await chatService.getMessage(roomId, item)
            io.to(item).emit('MESSAGE_SENT', chatMessages)
        })
    })
}