import DataBase from '../database/index'

const db = new DataBase()

const socketController = socket => {
    socket.on('nickname', nickname => {
        socket.emit('nickname-response', { success: db.addUser(nickname) })
    })
    socket.on('find-room', nickname => {
        for (const key in db.rooms) {
            if (Object.hasOwnProperty.call(db.rooms, key)) {
                const room = db.rooms[key]
                if (room.participants.length < 2) {
                    socket.join(room.id)
                    socket.emit('find-room-response', room)
                    socket.to(room.id).emit('new-mate', nickname)
                    room.participants.push(nickname)
                    return true
                }
            }
        }
        const roomId = Date.now()
        db.addRoom(nickname, roomId)
        socket.join(roomId)
        socket.emit('find-room-response', db.rooms[nickname])
    })
    socket.on('new-message', data => {
        socket.to(data.room).emit('new-message', { nickname: data.nickname, message: data.message })
    })
}

export default socketController