import * as THREE from 'three'
import { lerp } from 'three/src/math/MathUtils'
import { getSocketEvent } from '../../connection/Socket' 
export default class Enemy
{
  constructor(redlibcore, models){

    this.group = new THREE.Group()

    let selfGameId = null
    let playersObject = null
    this.init = (playerGameId) => {
        selfGameId = playerGameId
        playersObject = {}
        this.group.clear()
    }


    // active
    let isActive = false
    this.active = () => { isActive = true }
    this.deActive = () => { isActive = false }

    /**
     * listen to socket event
     */
    const event = getSocketEvent()

    //! move this event to enemy class
    // server on new player join
    // socket.on("game-new-player",( response ) => {
    //     if ( response.status == 200 ){
    //         this.enemys.updateEnemys(response.playersGameId,response.position)
    //     }
    // })
    
    // game on some player disconnect
    // socketEvents.addCallBack("playerLeft", player => {
    //     this.enemys.playerLeave(response.playerGameId)
    // })

    // server update game info  
    // socketEvents.addCallBack("sugi", (time ,gameInfo) => {
    //     this.enemys.updateGameInfo(time ,gameInfo)
    // })
    // new player join
    event.addCallBack('updateEnemy',(playersInfo) => {
        Object.keys(playersInfo).forEach(gameId => {
            // return if player Game id is for this user
            if ( gameId == selfGameId ){ return }

            // return if player Game id already exist
            else if ( playersObject[gameId] ){ return }

            // create new enemy
            const newEnemy = models.spaceShip.clone()
            this.group.add(newEnemy)

            // we have 3 state on enemy player game info
            // state : good == ping is less than 100
            // state : bad  == ping is less than 500
            // state : dc   == last gameInfo is more than 500 ms
            playersObject[gameId] = {
                model : newEnemy,
                state : "new", // "good" | "bad" | "dc" | "new"
                gameInfos : [playersInfo[gameId]],
            }
            setTimeout(() => {
                if (playersObject[gameId]){
                playersObject[gameId].state = "bad"
                }
            }, 1000)
        })
    })

    // some player left 
    event.addCallBack('playerLeft', (player) => {
        console.log("player left");
        console.log(player)
        const { playerGameId } = player
        this.group.remove(playersObject[playerGameId].model)
        delete playersObject[playerGameId]
    })

    /**
     * enemy position predict
     */

    const interpolationTime = 200
    const badConnectionTime = 500


    // handel information came from server game loop
    event.addCallBack('updateGameInfo',(gameInfo) => {
        Object.keys( playersObject ).forEach(id => {
            if ( id == selfGameId ) { return }
            
            const playerObject = playersObject[id]
            const serverInfo = gameInfo[id]

            // check is this state is updated
            if (playerObject.gameInfos[playerObject.gameInfos.length -1 ].t < serverInfo.t){
                // if it is added to gameInfos array
                playerObject.gameInfos.push(serverInfo)
            }
        })
    })

    redlibcore.globalEvent.addCallBack('process', (delta, now) => {
        if (!isActive){return}

        Object.keys( playersObject ).forEach(id => {
            const player = playersObject[id]

            if ( player.state == "new" ){ 
                return
            }

            const renderTime = now - interpolationTime
            const badStateTime = now - badConnectionTime

            const lastGameInfo = player.gameInfos[player.gameInfos.length -1]

            if ( lastGameInfo.t > renderTime ){
                // update state
                player.state = "good"

                // save future position
                const future = lastGameInfo
                let nearest;

                // find closet gameInfo to renderTime
                let founded = false
                for (let index = player.gameInfos.length -1; index > -1; index-- ){
                    if (player.gameInfos[index].t < renderTime && !founded ){
                        founded = true
                        nearest = player.gameInfos[index]
                    } else
                    // clear old states
                    if (player.gameInfos[index].t < renderTime - 500 ){
                        player.gameInfos.splice(index,1)
                    }
                }

                // update model position
                const LerpValue = (renderTime - nearest.t) / (future.t - nearest.t)
                player.model.position.x = lerp(nearest.px, future.px, LerpValue)
                player.model.position.y = lerp(nearest.py, future.py, LerpValue)
                player.model.position.z = lerp(nearest.pz, future.pz, LerpValue)
                player.model.rotation.y = lerp(nearest.ry, future.ry, LerpValue)

            } else
            // state is bad package time is less than render time
            if ( lastGameInfo.t > badStateTime ) {
                // update state
                player.state = "bad"

                // save nearest position
                const nearest = lastGameInfo
                let closest = null
                const nearestTime = nearest.t
                // find closet gameInfo to nearest that time is less than 100 ms
                let founded = false
                for (let index = player.gameInfos.length -1; index > -1; index-- ){
                    if (player.gameInfos[index].t < nearestTime - 100 && !founded ){
                        founded = true
                        closest = player.gameInfos[index]
                    } else
                    // clear old states
                    if (player.gameInfos[index].t < renderTime - badConnectionTime ){
                        player.gameInfos.splice(index,1)
                    }
                }

                // player.model.position.x = ax +c => 
                // a = (nearest.x - closest.x) /  (nearest.t - closest.t)
                // renderPosition = a ( renderTime - nearestTime ) + nearestPosition
                player.model.position.x = (nearest.px - closest.px) /  (nearest.t - closest.t) * (renderTime - nearest.t ) + nearest.px
                player.model.position.y = (nearest.py - closest.py) /  (nearest.t - closest.t) * (renderTime - nearest.t ) + nearest.py
                player.model.position.z = (nearest.pz - closest.pz) /  (nearest.t - closest.t) * (renderTime - nearest.t ) + nearest.pz
                player.model.rotation.y = (nearest.ry - closest.ry) /  (nearest.t - closest.t) * (renderTime - nearest.t ) + nearest.ry

            }
            // state is disconnected and player don't update his position last 400 ms
            else {
                // update state
                player.state = "dc"

                // set newest position
                player.model.position.x = lastGameInfo.px
                player.model.position.y = lastGameInfo.py
                player.model.position.z = lastGameInfo.pz
                player.model.rotation.y = lastGameInfo.ry
                

                // clear useless gameInfos
                const lastPlayerGameInfoIndex = player.gameInfos.length -1
                for (let index = lastPlayerGameInfoIndex; index > -1; index-- ){
                    if ( index !== lastPlayerGameInfoIndex){
                        player.gameInfos.splice(index,1)
                    }
                }
            }
        })
    })

  }
}