const { v4: uuidv4 } = require('uuid');

class User
{
    constructor(socket,io,manager){
        this.socket = socket
        this.io = io
        this.manager = manager
        
        this.id = uuidv4()
        this.username = null
        this.room = null

        // add "set-username" event
        this.socket.on("set-username", (username) => {this.setUsername(username)})

        
        /**
         * room events
         */
        // create
        this.socket.on("create-room", (roomName) => {this.createRoom(roomName)})

        // join
        this.socket.on("join-room", (roomId) => {this.joinRoom(roomId)})

    }
    // send back error
    sendError(status, message){
        this.io.to(this.socket.id).emit('server-error',{status,message})
    }
    // set username
    setUsername(username){
        if (username){
            this.username = username
            this.manager.newUser(this.socket.id)
            this.manager.getAllRooms()
            this.io.to(this.socket.id).emit('server-username-set',{
                status : 200,
                username : username
            })
            console.log(`user id ${this.socket.id} pick ${this.username} as username`);
        } else {
            this.sendError(400,"username is empty")
        }
    }
    /**
     * room fucntions
     */
    createRoom(roomName){
        this.room = this.manager.createRoom(roomName,this)
        this.activeRoom()
    }

    joinRoom(roomId){
        const room = this.manager.joinRoom(roomId,this)
        if (room) {
            this.room = room
            this.activeRoom()
        } else {
            this.sendError(404,"room not founded")
        }
    }

    activeRoom(){
        this.io.to(this.socket.id).emit("server-active-room",{
            status : 200,
            room : this.room.serialize()
        })
    }

    serialize(){
        return {
            id : this.id,
            username : this.username
        }
    }
}

module.exports = User