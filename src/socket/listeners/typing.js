
module.exports = ({ socket, chatService }) => { 
    socket.on('TYPE', async ( { roomId, to, status} ) => {
        let receipment
        if(to.id){
            receipment = to.id
        }else{
            const receipmentData = await chatService.getToUserByRoom(socket.userId, roomId)
            receipment = receipmentData.userId
        }
        socket.to(receipment).emit('TYPING', status)
    })
}