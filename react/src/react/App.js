import React, { useState, useEffect } from 'react'

// components
import UserNameSet from './UserNameSet'
import UserName from './UserName'
import Rooms from './Rooms'
import RoomName from './RoomName'



export default function App() {
  const [isUsername, setIsUsername] = useState(false)
  const [username, setUsername] = useState('')

  const [isRoomSet, setIsRoomSet] = useState(false)
  const [room, setRoom] = useState({})
  const [rooms, setRooms] = useState([])

  useEffect(() => {

    // error events
    socket.on("server-error",(response) => {
      alert(`error is : ${response.messae}`)
    })

    // username set event 
    socket.on("server-username-set",(response) => {
      if (response.status == 200) {
        setIsUsername(true)
        setUsername(response.username)
        socket.emit("get-rooms")
      }
    })


    // get all rooms event
    socket.on("server-send-all-rooms", response => {
        console.log("server-send-all-rooms");
        console.log(response);
        if ( response.status === 200 ) {
        setRooms(response.rooms)
        }
    })

    // active room
    socket.on("server-active-room", response => {
      if ( response.status === 200 ) {
        setIsRoomSet(true)
        setRoom(response.room)
      } else if ( response.status === 404 ){
        alert(`messae error is ${response.messae}`)
      }
    })

    // update room info
    socket.on("server-update-room-info", response => {
      if ( response.status === 200 ) {
        setRoom(response.room)
      } else if ( response.status === 404 ){
        alert(`messae error is ${response.messae}`)
      }
    })

    // new player join
    socket.on("server-new-player-join", response => {
      if ( response.status === 200 ) {
        alert(`${response.player.username} join to room`)
      }
    })

    return () => {
      socket.off("server-error")
      socket.off("server-username-set")
      socket.off("server-send-all-rooms")
      socket.off("server-active-room")
      socket.off("server-active-room")
      socket.off("server-update-room-info")
      socket.off("server-new-player-join")
    }
  })


  return (
    <div className='app' >
        {!isUsername ? 
        <UserNameSet/>
        :
        <>
          <UserName userName={username}/> 
          {
          isRoomSet ?
          <RoomName room={room} />
          :
          <Rooms  rooms={rooms}/>
          }
        </>
        }
    </div>
  )
}
