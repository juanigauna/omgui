import { v4 as generateId } from 'uuid'

class DataBase {
    static instance
    constructor() {
        if (!!DataBase.instance) {
            return DataBase.instance
        }
        this.onlineCounter = 0
        this.users = []
        this.rooms = []
        this.queue = []
        DataBase.instance = this
    }
    findUser(nickname) {
        const findUser = this.users.filter(value => value.nickname === nickname)
        return findUser.length === 0 ? false : true
    }
    addUser(nickname, socketId) {
        this.users.push({
            nickname,
            socketId,
            roomId: ''
        })
    }
    getUser(socketId) {
        const findUser = this.users.filter(value => value.socketId === socketId)
        return findUser.length === 0 ? false : findUser[0]
    }
    setRoomIdToUser(nickname, roomId) {
        this.users.forEach((user, index) => {
            if (user.nickname === nickname) {
                this.users[index].roomId = roomId
            }
        })        
    }
    removeUser(socketId) {
        this.users.filter((user, index) => {
            if (user.socketId === socketId) {
                this.users.splice(index, 1)
            }
        })
    }
    joinQueue(nickname) {
        this.queue.push(nickname)
    }
    createRoom(nickname) {
        const structure = {
            id: generateId(),
            participants: [nickname]
        }
        this.rooms.push(structure)
        return structure
    }
    addParticipantToRoom(roomId, nickname) {
        this.rooms.forEach((room, index) => {
            if (room.id === roomId) {
                this.rooms[index].participants.push(nickname)
            }
        })    
    }
    removeParticipantToRoom(roomId, nickname) {
        const roomIndex = this.rooms.findIndex(room => room.id === roomId)
        if (roomIndex !== -1) {
            const userIndex = this.rooms[roomIndex].participants.findIndex(user => user === nickname)
            this.rooms[roomIndex].participants.splice(userIndex, 1)
        }

    }
    updateCounter(action) {
        action === 'plus' ? this.onlineCounter += 1 : this.onlineCounter -=1
        return this.onlineCounter
    }
}

export default DataBase