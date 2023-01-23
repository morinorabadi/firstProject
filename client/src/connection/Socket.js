import { io } from 'socket.io-client'
import Events from '../redlibCore/utils/Events'
class Socket
{
    constructor(){
        // create socket instance
        const socket = io(`${process.env.DOMAIN}:${process.env.PORT}`)

        // create socket event 
        this.event = new Events()
        
        // create Global Emit socket Function
        this.emit = (eventName,eventProp) => {
            socket.emit(eventName,eventProp)
        }

        // create Global Emit socket Function
        this.volatileEmit = (eventProp) => {
            socket.volatile.emit("game-info",eventProp)
        }

        // response check function 
        function responseCheck(response){
            if ( response.status >= 200 && response.status < 300 ){
                return true
            }
            return false
        }

        /**
         * Connection
         */

        // connection state change
        this.event.addEvent("connectionState")

        // error event
        this.event.addEvent("error")
        
        // username event
        this.event.addEvent("usernameSet")
        
        // room event
        this.event.addEvent("activeRoom")
        this.event.addEvent("updateRoomInformation")
        this.event.addEvent("updateActiveRoomInformation")
        
        // game event
        this.event.addEvent('createWorld')
        this.event.addEvent('startGame')
        this.event.addEvent('updateEnemy')
        this.event.addEvent('updateGameInfo')

        // game and room event
        this.event.addEvent("playerJoin")
        this.event.addEvent("playerLeft")
        this.event.addEvent("roomDestroyed")
        
        let pingLoopId = null
        // connect event
        socket.on("connect", () => {
            console.log("connected-- id : ",socket.id)
            this.event.callEvent("connectionState", socket.connected)

            // show ping and calculate server delay
            //! set global clock
            const ping = document.getElementById('ping')
            pingLoopId = setInterval( () => {
                const now = Date.now()
                socket.emit("ping", () => {
                    ping.textContent = `${Date.now() - now} : ping`
                })
            }, 500)


            // self set username set
            socket.on("server-username-set",(response) => {
                if (responseCheck(response)){
                    this.event.callEvent("usernameSet", response.username)
                    socket.emit("get-rooms")
                }
            })

            /**
             * room events
             */

            // get all rooms information event
            socket.on("server-send-all-rooms", response => {
                if (responseCheck(response)) {
                    this.event.callEvent("updateRoomInformation", response.rooms)
                }
            })

            // active room
            socket.on("server-active-room", response => {
                if ( responseCheck(response) ) {
                    console.log("createWorld in socket");
                    this.event.callEvent( "activeRoom", response.room )
                    this.event.callEvent("createWorld", response)
                } else {
                    this.event.callEvent( "error", response.message )
                }
            })

            // update active room information
            socket.on("server-update-room-info", response => { 
                if ( responseCheck(response) ){
                    this.event.callEvent( "updateActiveRoomInformation", response.room )
                }
            })

            // new player join
            socket.on("server-new-player-join", response => {
                if ( responseCheck(response) ) {
                    // for ui alert
                    this.event.callEvent( "playerJoin", response.player )
                }
            })

            /**
             * game events
             */
            
            // start game event
            socket.on("server-start-game", ( response ) => {
                if ( responseCheck(response) ){
                    this.event.callEvent("startGame", response)
                }
            })

            // server on new player join
            socket.on("game-new-player",( response ) => {
                if ( responseCheck(response) ){
                    this.event.callEvent("updateEnemy", response.playersGameId)
                }
            })

            // update game info
            socket.on("sugi", (data) => {
                this.event.callEvent('updateGameInfo', data)
            })

            /**
             * room and game events 
             */
        
            // some player disconnect from room
            socket.on("server-player-disconnect", response => {
                if ( responseCheck(response) ) {
                    this.event.callEvent( "playerLeft", response.player )
                }
            })
            
            // some player disconnect from room
            socket.on("server-room-destroyed", response => {
                if ( responseCheck(response) ) {
                    this.event.callEvent( "roomDestroyed")
                }
            })

        })
        
        // disconnect event
        socket.on("disconnect", () => {
            console.log("disconnect try to reconnect ")
            clearInterval(pingLoopId)
            this.event.callEvent("connectionState", socket.connected)
        });
        
        // connect_error error
        socket.on("connect_error", () => {
            setTimeout(() => {socket.connect();}, 1000);
        })
    }
}

// init socket Class
let socket = null
export function socketInit(){
    if (socket == null){
        socket = new Socket() 
    }
}

// get socket events for listen od remove for some event
export function getSocketEvent(){
    if (socket){
        return socket.event
    }
}

// emit some event with some prop
export function socketEmit(eventName,eventProp){
    socket.emit(eventName,eventProp)
}


// volatile emit with some prop
export function socketVolatileEmit(eventProp){
    socket.volatileEmit(eventProp)
}