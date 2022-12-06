import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

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

  const [alertt, setAlertt] = useState({
    title : "User Left!",
    text : "some user leavr room",
    isGood : false
  })

  function sendAlertt(title,text,isGood) {
    setAlertt({title,text,isGood})
    gsap.to('.custom-alert', {
      duration : 0.5,
      top : "20px",
      onComplete : () => {
        setTimeout(() =>{
          gsap.to('.custom-alert', {
              duration : 0.5,
              top : "-70px",
            }
          )
        }, 2000)
      }
    })
  }


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
        if ( response.status === 200 ) {
        setRooms(response.rooms)
        }
    })

    // active room
    socket.on("server-active-room", response => {
      if ( response.status === 200 ) {
        setIsRoomSet(true)
        document.querySelector('.curtain').style.background = "transparent"
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
        sendAlertt("Player Join!!",`${response.player.username} join to room`,true)
      }
    })

    // some player disconnect from room
    socket.on("server-player-disconnect", response => {
      if ( response.status === 200 ) {
        sendAlertt("Player Left!!",`${response.player.username} left the room`,false)
      }
    })

    // some player disconnect from room
    socket.on("server-room-destroyed", response => {
      if ( response.status === 200 ) {
        sendAlertt("Room Destroyed!!","owner leave left the room",false)
        setIsRoomSet(false)
        document.querySelector('.curtain').style.background = "#333"
      }
    })
    
    
    return () => {
      socket.off("server-error")
      socket.off("server-username-set")
      socket.off("server-send-all-rooms")
      socket.off("server-active-room")
      socket.off("server-update-room-info")
      socket.off("server-new-player-join")
      socket.off("server-player-disconnect")
      socket.off("server-room-destroyed")
      
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
        {/* curtain div is only for hide canvas can replace with image */}
        <div className='curtain'></div>
        <div className='custom-alert' style={alertt.isGood ? {backgroundColor : "#6f6"} : {backgroundColor : "#f66"} } >
            <h6> { alertt.title } </h6>
            <p> { alertt.text } </p>
        </div>
    </div>
  )
}
