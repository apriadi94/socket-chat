
module.exports = ({ io, socket, chatService }) => { 
    socket.on('STORE_MESSAGE_CHAT', async ({ roomId, message, type, to, url = null, width = null, height = null }) => {

        const userId = socket.userId
        const storeMessage = await chatService.storeMessage({ userId, roomId, message, type, to, url, width, height })
        const receipt = storeMessage.map(item => {return { userId: item.userId, roomId: item.roomId }})

        receipt.forEach(async item => {
            const chatMessages = await chatService.getMessage(item.roomId, item.userId)
            const roomConversation = await chatService.roomConversation(item.userId)

            io.to(item.userId).emit('MESSAGE_SENT', chatMessages, item.roomId)
            io.to(item.userId).emit('CONVERSATION_SENT', roomConversation)
        })
    })
}