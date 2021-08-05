class DataBase {
    static instance
    users = {}
    constructor() {
        if (!!DataBase.instance) {
            return DataBase.instance
        }
        this.users = {}
        this.rooms = {}
        DataBase.instance = this
    }
    addUser(nickname) {
        if (!this.users[nickname]) {
            this.users[nickname] = { nickname }
            return true
        }
        return false
    }
    addRoom(nickname, id) {
        this.rooms[nickname] = {
            id,
            name: `${nickname}'s room`,
            participants: [nickname]
        }
    }
}

export default DataBase