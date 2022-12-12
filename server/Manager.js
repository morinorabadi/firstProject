const Room = require('./Room')
const User = require('./User')


class Manager
{
    constructor(io){
        this.io = io
        this.rooms = []
        this.users = {}
        this.userIdWithOutRoom = []
    }
    
    // server create new user join
    newUser(socket){
        console.log(`new user with "${ socket.id }" Id join`)
        this.userIdWithOutRoom.push(socket.id)
        this.users[socket.id] = new User(socket,this)
    }

    // server user left the server
    userDisconnect( socketId ){
        // console log some info
        console.log(`"${ socketId }" left the server`);
        
        // greb user and user room
        const user = this.users[socketId]

        if ( user.room ) { 
            const room = user.room

            // find user base on user id
            const playerIdIndex = room.players.map( player => player.id ).indexOf(user.id)

            // if user found
            if ( playerIdIndex > -1 ){
                // chech if disconnect user is owner or not
                if ( room.players[playerIdIndex].id == room.ownerId ){
                    // clear game loop
                    clearInterval(room.loopId)

                    // tell other user in this room about room destroyed 
                    this.io.to(room.id).emit("server-room-destroyed", {status : 200})
                    this.io.to(room.id).emit("game-room-destroyed", {status : 200})
                    
                    // console log some info
                    console.log(`"${ user.username }" destroyed the "${room.name}" room`);

                    // clean up room
                    this.rooms = this.rooms.filter( managerroom =>  managerroom.id !== room.id )

                    console.log("\n\n\n\n\n",this.rooms.length);
                    // update users room info
                    this.updateAllRoomsInfo()
                } else {
                    // decrement room playerCount
                    room.playerCount--

                    // find playerGameId
                    let playerGameId = null
                    for (const  id of Object.keys(room.playersGameId)) {
                        if ( room.playersGameId[id] == user.id ){ playerGameId = id }
                    }
                    
                    // update ui room info
                    room.updateUiRoomInfo()

                    // emit player disconnet to others ui in room
                    this.io.to(room.id).emit("server-player-disconnect", {
                        status : 200,
                        player: room.players[playerIdIndex].serialize()
                    })
                    // emit player disconnet to others game in room
                    this.io.to(room.id).emit("game-player-disconnect", {
                        status : 200,
                        playerGameId : playerGameId,
                    })

                    // console log some info
                    console.log(`"${ user.username }" left the "${room.name}" room`);

                    // clean up
                    delete room.playersGameId[playerGameId]

                    delete room.gameInfo[playerGameId]

                    // delete player from room
                    room.players.splice(playerIdIndex,1)
                }
            }
        }
        // clean up user 
        delete this.users[socketId]
        
    }

    // user create room
    createRoom(roomName,user){
        const room = new Room(this.io,roomName,user)
        this.deleteUserIdWithOutRoom(user.socket.id)
        this.rooms.push(room)
        this.updateAllRoomsInfo()
        console.log(`user ${user.username} create ${roomName} room `);
        return room
    }

    // user join to room
    joinRoom(roomId,user){
        const room = this.rooms.find( room => room.id == roomId)
        if (room){
            room.join(user)
            this.deleteUserIdWithOutRoom(user.socket.id)
            this.updateAllRoomsInfo()
            console.log(`user ${user.username} join ${room.name} room `);
            return room
        }
    }

    // send out rooms info to user that dont have room
    updateAllRoomsInfo(){
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

    // delete this socket id to prevnt send out rooms info
    deleteUserIdWithOutRoom(UsersocketId){
        this.userIdWithOutRoom = this.userIdWithOutRoom.filter(socketId => {
            return UsersocketId !== socketId
        })
    }

    // add this socket id to send out rooms info
    addUserIdWithOutRoom(UsersocketId){
        this.userIdWithOutRoom.push(UsersocketId)
    }
}
module.exports = Manager