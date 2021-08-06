import DataBase from '../database/index'

const db = new DataBase()

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

const socketController = (io, socket) => {
    io.emit('online-counter', db.updateCounter('plus'))
    socket.on('nickname', nickname => {
        const findUser = db.findUser(nickname)
        if (!db.findUser(nickname)) {
            db.addUser(nickname, socket.id)
        }
        socket.emit('nickname-response', { success: !findUser })
        console.log(db.users)
    })
    socket.on('find-room', async nickname => {
        // db.joinQueue(nickname)
        await setTimeout(() => {
            // const totalInQueue = db.queue.length%2 === 0 ? db.queue.length : db.queue.length-1
            // const numberRooms = totalInQueue / 2
            // for (let index = 1; index <= numberRooms; index++) {
            //     db.createRoom()
            // }
            const findRoom = db.rooms.filter(room => room.participants.length < 2)
            let room = {}
            if (findRoom.length > 0) {
                const randomIndex = randomInt(0, findRoom.length - 1)
                room = findRoom[randomIndex]
                db.addParticipantToRoom(room.id, nickname)
                socket.to(room.id).emit('join', nickname)
            } else {
                room = db.createRoom(nickname)
            }
            db.setRoomIdToUser(nickname, room.id)
            socket.join(room.id)
            socket.emit('find-room-response', room)
        }, 4000)
    })
    socket.on('new-message', data => {
        socket.to(data.room).emit('new-message', { nickname: data.nickname, message: data.message })
    })
    socket.on('disconnect', () => {
        const user = db.getUser(socket.id)
        if (user.roomId !== '') {
            db.removeParticipantToRoom(user.roomId, user.nickname)
            socket.to(user.roomId).emit('leave-mate')
            db.removeUser(socket.id)
        }
        io.emit('online-counter', db.updateCounter('substract'))
    })
}

export default socketController