const { v4: uuidv4 } = require('uuid');

class User
{
    constructor(socket,manager){
        this.socket = socket
        this.io = manager.io
        this.manager = manager
        
        this.id = uuidv4()
        this.username = null
        this.playerGameId = null
        this.room = null

        // disconnecting event
        this.socket.on("disconnect", () => { this.manager.userDisconnect(this.socket.id) })

        // add ping event
        this.socket.on('ping', callback => { callback() })

        // add "set-username" event
        this.socket.on("set-username", (username) => {this.setUsername(username)})

        /**
         * room events
         */
        // create
        this.socket.on("create-room", (roomName) => {this.createRoom(roomName)})

        // join
        this.socket.on("join-room", (roomId) => {this.joinRoom(roomId)})

        /**
         * Game events
         */
        // load over
        this.socket.on("load-over", (time) => { this.room.worldLoadOver(this.socket.id, this.playerGameId,time) })

        // update game info
        this.socket.on("ugi", (data) => { this.room.updatePlayerInfo(data) })

        // room-destroyed-done
        this.socket.on("room-destroyed-done", () => { this.roomForceLeave() })
        
    }
    // send back error
    sendError(status, message){
        this.io.to(this.socket.id).emit('server-error',{status,message})
    }
    // set username
    setUsername(username){
        if (username){
            this.username = username
            this.manager.addUserIdWithOutRoom(this.socket.id)
            this.manager.updateAllRoomsInfo()
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
     * room functions
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
        this.playerGameId = this.room.generatePlayerId(this.id) 
        this.io.to(this.socket.id).emit("server-create-world",{
            status : 200,
            baseWorldData : this.room.world.baseWorld,
            playerGameId : this.playerGameId
        })
    }

    roomForceLeave(){
        this.playerGameId = null
        this.socket.leave(this.room.id)
        this.room = null
        this.manager.addUserIdWithOutRoom(this.socket.id)
        this.manager.updateAllRoomsInfo()
    }
    /**
     * global functions
     */
    serialize(){
        return {
            id : this.id,
            username : this.username
        }
    }
}

module.exports = User