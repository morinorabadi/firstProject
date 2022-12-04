import { io } from 'socket.io-client'


/**
 * setup socket
 */
// init
socketStates = {
    connected : false,
}

window.socket = io("http://localhost:3000")

// connect event
socket.on("connect", () => {
    console.log("connected-- id : ",socket.id);
    states.connected = true
})

// disconnect event
socket.on("disconnect", () => {
    console.log("disconnect try to reconnect ")
    states.connected = false
    socket.connect();
});

// connect_error error
socket.on("connect_error", () => {
    setTimeout(() => {socket.connect();}, 1000);
});



reactUI.render()