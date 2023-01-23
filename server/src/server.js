const express = require('express')
const http = require('http');
const {Server} = require('socket.io')
const path = require("path")

// load Config file
require('dotenv').config({ path: path.join( __dirname, `../../.env.${process.env.NODE_ENV}`)})

const Manager = require('./game/Manager')
const app = express()
const server = http.createServer(app)


app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'))
})



const io = new Server(server,{cors : {origin : '*'}})
const manager = new Manager(io)

io.on('connection', socket => {
    manager.newUser(socket)
})


server.listen(process.env.PORT,() => {
    console.log("server is active on port ", process.env.PORT);
})
