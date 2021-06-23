
module.exports = ({ io, socket, chatService }) => { 
    socket.on('STORE_MESSAGE_CHAT', async ({ roomId, message, type, to }) => {
        const userId = socket.userId
        const storeMessage = await chatService.storeMessage({ userId, roomId, message, type, to })
        const receipt = storeMessage.map(item => item.userId)

        receipt.forEach(async item => {
            const chatMessages = await chatService.getMessage(roomId, item)
            const roomConversation = await chatService.roomConversation(item)
            
            io.to(item).emit('MESSAGE_SENT', chatMessages)
            io.to(item).emit('CONVERSATION_SENT', roomConversation)
        })
    })
}