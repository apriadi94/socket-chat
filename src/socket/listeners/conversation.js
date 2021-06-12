
module.exports = ({ socket, chatService }) => { 
    socket.on('REQUEST_CONVERSATION', async () => {
        const roomConversation = await chatService.roomConversation(socket.userId)
        socket.emit('CONVERSATION_SENT', roomConversation)
    })
}