const Room = require('./Room')

class Manager
{
    constructor(io){
        this.io = io
        this.rooms = []
        this.userIdWithOutRoom = []
    }
    
    newUser(socketId){
        this.userIdWithOutRoom.push(socketId)
    }

    createRoom(roomName,User){
        const room = new Room(this.io,roomName,User)
        this.updateUserIdWithOutRoom(User.socket.id)
        this.rooms.push(room)
        this.getAllRooms()
        return room
    }

    joinRoom(roomId,User){
        const room = this.rooms.find( room => room.id == roomId)
        if (room){
            room.join(User)
            this.updateUserIdWithOutRoom(User.socket.id)
            this.getAllRooms()
            return room
        }
    }
    getAllRooms(){
        console.log(this.userIdWithOutRoom);
        this.io.to(this.userIdWithOutRoom).emit(
            "server-send-all-rooms", 
            {
                status : 200,
                rooms : this.rooms.map( room => {
                    return {
                        id : room.id,
                        name : room.name,
                        playerCount : room.playerCount,
                    }
                })
            }
        )
    }

    updateUserIdWithOutRoom(UsersocketId){
        this.userIdWithOutRoom = this.userIdWithOutRoom.filter(socketId => {
            return UsersocketId !== socketId
        })
    }



}
module.exports = Manager