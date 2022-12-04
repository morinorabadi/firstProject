const app = require('express')()
const http = require('http');
const {Server} = require('socket.io')

const Manager = require('./Manager')
const User = require('./User')

const server = http.createServer(app)
const io = new Server(server,{cors : {origin : '*'}})


const manager = new Manager(io)

io.on('connection', socket => {
    console.log(`user with "${ socket.id }" Id join`)
    new User(socket,io,manager)
})


server.listen(3000,() => {
    console.log("server is active...");
})
