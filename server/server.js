const app = require('express')()
const http = require('http');

const {Server} = require('socket.io')
const server = http.createServer(app)
const io = new Server(server,{cors : {origin : '*'}})


io.on('connection', socket => {
    console.log(`user with "${ socket.id }" Id join`)
    
})


server.listen(3000,() => {
    console.log("server is active...");
})
