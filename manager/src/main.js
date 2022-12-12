import { io } from 'socket.io-client'


/**
 * setup socket
 */
// init
const socketStates = {
    connected : false,
}

window.socket = io("http://159.69.180.15:3000")
// window.socket = io("http://127.0.0.1:3000")

// connect event
socket.on("connect", () => {
    console.log("connected-- id : ",socket.id);
    socketStates.connected = true
})

// disconnect event
socket.on("disconnect", () => {
    console.log("disconnect try to reconnect ")
    states.connected = false
    socketStates.connect();
});

// connect_error error
socket.on("connect_error", () => {
    setTimeout(() => {socket.connect();}, 1000);
});


/**
 * instantiate create react UI
 */
reactUI.render()

/**
 * instantiate redlib core
 */
const redlibcore = new redlib.RedLib({fps : 60})

/**
 * instantiate main scene
 */
const scene = new main.Scene(redlibcore)