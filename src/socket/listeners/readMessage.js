
module.exports = ({ io, socket, chatService }) => { 
    socket.on('READ_MESSAGE', async ( roomId ) => {
        await chatService.changeUnreadmessage(roomId, socket.userId)

        const roomConversation = await chatService.roomConversation(socket.userId)
        io.to(socket.userId).emit('CONVERSATION_SENT', roomConversation)
    })
}