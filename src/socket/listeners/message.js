
module.exports = ({ socket, chatService }) => { 
    socket.on('REQUEST_MESSAGE', async ({ roomId = null, to = null }) => {
        let chatMessages
        let dataRoomId

        if(roomId){
            chatMessages = await chatService.getMessage(roomId, socket.userId)
            dataRoomId = roomId
        }else{
            const roomData = await chatService.getRoomData(to, socket.userId)
            if(roomData){
                dataRoomId = roomData
                chatMessages = await chatService.getMessage(roomData, socket.userId)
            }else{
                chatMessages = []
                dataRoomId = null
            }
        }

        socket.emit('MESSAGE_SENT', chatMessages, dataRoomId, '', '')
    })
}