import React, { useState, useEffect } from 'react'
import { gsap } from 'gsap'

// components
import UserNameSet from './UserNameSet'
import UserName from './UserName'
import Rooms from './Rooms'
import RoomName from './RoomName'

import { getSocketEvent } from '../../connection/Socket'

import Scene from '../../three/Scene'
let scene = null

export default function App() {
  const [isSocketConnected, setIsSocketConnected] = useState(false)

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

  const [isLoadOver, setIsLoadOver] = useState(false)
  
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
    scene = new Scene()

    const socketEvent = getSocketEvent()

    // socket connection check
    const connectionStateId = socketEvent.addCallBack("connectionState", (state) => {
        setIsSocketConnected(state)
    })

    const errorId = socketEvent.addCallBack("error", errorMessage => {
      sendAlertt('something is wrong', errorMessage, false)
    })

    // username set event 
    const usernameSetId = socketEvent.addCallBack("usernameSet",(username) => {
        setIsUsername(true)
        setUsername(username)
        scene.load(() => {
          setIsLoadOver(true)
          console.log("load over")
        })
    })

    // get all rooms event
    const updateRoomInformationId = socketEvent.addCallBack("updateRoomInformation", rooms => {
        setRooms(rooms)
    })

    // active room
    const activeRoomId = socketEvent.addCallBack("activeRoom", room => {
        setIsRoomSet(true)
        document.querySelector('.curtain').style.background = "transparent"
        setRoom(room)
    })

    // update room info
    const updateActiveRoomInformationId = socketEvent.addCallBack("updateActiveRoomInformation", room => {
        setRoom(room)
    })

    // new player join
    const playerJoinId = socketEvent.addCallBack("playerJoin", player => {
        sendAlertt("Player Join!!",`${player.username} join to room`,true)
    })

    // some player disconnect from room
    const playerLeftId = socketEvent.addCallBack("playerLeft", player => {
        sendAlertt("Player Left!!",`${player.username} left the room`,false)
    })

    // some player disconnect from room
    const roomDestroyedId = socketEvent.addCallBack("roomDestroyed", () => {
        sendAlertt("Room Destroyed!!","owner leave left the room",false)
        setIsRoomSet(false)
        document.querySelector('.curtain').style.background = "#333"
    })
    
    
    return () => {
      socketEvent.removeCallBack("connectionState",connectionStateId)
      socketEvent.removeCallBack("error",errorId)
      socketEvent.removeCallBack("usernameSet",usernameSetId)
      socketEvent.removeCallBack("updateRoomInformation",updateRoomInformationId)
      socketEvent.removeCallBack("activeRoom",activeRoomId)
      socketEvent.removeCallBack("updateActiveRoomInformation",updateActiveRoomInformationId)
      socketEvent.removeCallBack("playerJoin",playerJoinId)
      socketEvent.removeCallBack("playerLeft",playerLeftId)
      socketEvent.removeCallBack("roomDestroyed",roomDestroyedId)
    }
  }, [])


  return (
    <>
    {/* three stuff will be here  */}
    <canvas id="scene"></canvas>
    <div id="contoroller" style={{ display : "none" }} >
      <svg id="joy" viewBox="0 0 400 400">
          <circle className="big" cx="200" cy="200" r="100" />
          <circle className="small" cx="200" cy="200" r="70" />
      </svg>

      <svg id="speed"  viewBox="0 0 100 200">
          <rect width="40" height="100" x="38" y="50" rx="18" ry="18" />
          <circle r="18" cx="58" cy="110" />
      </svg>
    </div>
    <div id="ping"></div>
    {
      isSocketConnected ?
        <div className='app' >
            {!isUsername ? 
            <UserNameSet/>
            :
            <>
              <UserName userName={username}/> 
              {
              isRoomSet ?
              <>
                <RoomName room={room} />
                {
                  !isLoadOver?
                    <div id="loading"></div>
                  :
                    <></>
                }
              </>
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
        :
        <h1> try to connect to server </h1>
    }
    </>
  )
}
