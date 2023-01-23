import React from 'react'

export default function RoomName({room}) {
  return (
        <div className='room-info' >
            <p> room name is <span> { room.name }</span></p>
            <p> room owener is <span> { room.ownerName }</span></p>
            <ul>
                <li> active players count : {room.playersCount} </li>
                {
                    room.players.map(player => {
                        return <li key={player.id} > {player.username} </li>
                    })
                }
            </ul>
        </div>
  )
}