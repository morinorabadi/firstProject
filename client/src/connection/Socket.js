import { io } from 'socket.io-client'


/**
 * setup socket
 */
// init
// window.socket = io("http://159.69.180.15:3000")
window.socket = io("http://127.0.0.1:3000")

// connect event
socket.on("connect", () => {
    console.log("connected-- id : ",socket.id);
})

// disconnect event
socket.on("disconnect", () => {
    console.log("disconnect try to reconnect ")
    socketStates.connect();
});

// connect_error error
socket.on("connect_error", () => {
    setTimeout(() => {socket.connect();}, 1000);
});
