const { v4: uuidv4 } = require('uuid');

class Room
{
    constructor(io,name,User){
        this.io = io
        this.id = uuidv4()
        this.name = name

        this.ownerId = User.id
        this.ownerName = User.username
        this.playerCount = 1
        this.players = [User]


        User.socket.join(this.id)
    }
    
    join(User){
        this.players.push(User)
        User.socket.join(this.id)
        this.playerCount++
        this.io.to(this.id).emit("server-new-player-join",{
            status : 200,
            player: User.serialize()
        })
        this.io.to(this.id).emit("server-update-room-info",{
            status : 200,
            room : this.serialize()
        })
        
    }

    leave(UserId){
        let founded = false
        this.players = this.players.filter(user => {
            if (user.id == UserId) {
                founded = true
                return false
            }
            return true
        })
        console.log("in Room clss leave founded == ",founded);
    }

    serialize(){
        return {
            id : this.id,
            name : this.name,
            ownerName : this.ownerName,
            playersCount : this.playerCount,
            players : this.players.map(user => {
                return user.serialize()
            })
        }
    }
}

module.exports = Room