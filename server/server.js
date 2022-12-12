const express = require('express')
const http = require('http');
const {Server} = require('socket.io')
const path = require("path")

const Manager = require('./Manager')


const app = express()
const server = http.createServer(app)
const io = new Server(server,{cors : {origin : '*'}})


app.use('/static', express.static(path.join(__dirname, '../dist')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
});


const manager = new Manager(io)

io.on('connection', socket => {
    manager.newUser(socket)
})


server.listen(3000,() => {
    console.log("server is active...");
})
