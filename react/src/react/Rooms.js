import React, { useState, useEffect } from 'react'

export default function Rooms({rooms}) {   
    const [ roomName, setRoomName ] = useState('')

    useEffect(() => {

        return () => {
            socket.off("server-send-all-rooms")
        }
    },[])

    function createRoom() {
        socket.emit('create-room',roomName)
        setRoomName('')
    }

    function joinRoom(roomId) {
        socket.emit('join-room', roomId)
    }
    
    return (
        <div className='rooms' >

            <h2>
                join or create room
            </h2>

            <ul>
            {rooms.map(room => (
                <li key={room.id} >
                <p>room name : {room.name}</p>
                <p>active player : {room.playersCount}</p>
                {/* add owner name */}
                <button onClick={()=> {joinRoom(room.id)}} > join </button>
                </li>
            ))}
            </ul>

            <div className='create-room' >
                <input
                type="text" 
                placeholder='enter room name'
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
                />
                <button onClick={() => (createRoom())} > create </button>
            </div>

        </div>
    )
}