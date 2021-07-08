
module.exports = ({ io, socket, chatService }) => { 
    socket.on('READ_MESSAGE', async ( roomId ) => {
        await chatService.changeUnreadmessage(roomId, socket.userId)

        const getTo = await chatService.getToUserByRoom(socket.userId, roomId)

        if(getTo){
            const chatMessages = await chatService.getMessage(roomId, getTo.userId)
            const rommConversationForReceipt = await chatService.roomConversation(getTo.userId)

            socket.to(getTo.userId).emit('CHECKLIST', chatMessages)
            io.to(getTo.userId).emit('CONVERSATION_SENT', rommConversationForReceipt)
        }

        const roomConversation = await chatService.roomConversation(socket.userId)
        io.to(socket.userId).emit('CONVERSATION_SENT', roomConversation)
    })
}