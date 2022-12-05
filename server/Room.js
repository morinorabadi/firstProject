const { v4: uuidv4 } = require('uuid');
const WorldGenerator = require('./game/WorldGenerator')


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

        this.world = new WorldGenerator()

        User.socket.join(this.id)

        // game
        this.isGameStart = false
        this.playerGameIdCount = 0
        this.playersGameId = {}
        this.gameInfo = {}
    }
    
    /**
     * before game start
     */
    join(User){
        this.players.push(User)
        User.socket.join(this.id)
        this.playerCount++
        // ui emit
        this.io.to(this.id).emit("server-new-player-join",{
            status : 200,
            player: User.serialize()
        })
        // ui emit
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
    /**
     * after game start
     */
    generatePlayerId(userId){
        console.log("\n\n\n\n\n\n\nn\n\n\n\ngeneratePlayerId\n\n\n\n\n\n\n\n\n");
        this.playerGameIdCount++
        const playerGameId = this.playerGameIdCount.toString()
        this.playersGameId[playerGameId] = userId
        this.gameInfo[playerGameId] = {t : 0}
        return playerGameId
    }

    worldLoadOver(playerGameId){
        if ( !this.isGameStart ){
            this.isGameStart = true
            this.startGame()
        } else {
            this.io.to(this.id).emit("game-new-player", {
                status : 200,
                playersGameId : Object.keys(this.playersGameId)
            })
        }
        this.io.to(this.id).emit("server-start-game")
    }
    // start game
    startGame(){
        // store loop id to remove after game over
        this.loopId = setInterval(()=>{
            // send out playrs information
            // fps is 50
            console.log("\n\n");
            console.log(this.gameInfo);
            this.io.to(this.id).emit("sugi",this.gameInfo)

        },500)
    }

    // 
    updatePlayerInfo(data){        
        if ( data.t > this.gameInfo[data.pi].t ) {
            this.gameInfo[data.pi] = data
        }
    }

    /**
     * global functions
     */
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