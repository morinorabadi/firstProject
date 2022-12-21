import * as THREE from 'three'

export default class Enemy
{
    constructor(redlibcore, models, getClock){
        this.group = new THREE.Group()
        this.group1 = new THREE.Group()
        this.charaterModel = models.spaseShip.clone()

        // clock
        this.getClock = getClock

        // add big Spase Ship
        this.spaseShip = models.bigSpaseShip
        this.spaseShip.position.y = -5

        this.baloons = new THREE.Group()
        
        this.baloon1 = models.baloon.clone()
        this.baloon1.position.x = 30
        this.baloons.add(this.baloon1)

        this.baloon2 = models.baloon.clone()
        this.baloon2.position.x = -30
        this.baloons.add(this.baloon2)

        this.group1.add(this.spaseShip, this.baloons)
        this.group1.position.x = -70
        this.group1.rotation.y = Math.PI / 6

        redlibcore.globalEvent.addCallBack('process', (delta) => { this.updatePosition(delta) })
    }
    
    init(playerGameId){
        this.selfGameId = playerGameId
        this.group.clear()
        this.playersObject = {}
    }

    active(){
        this.isActive = true
    }

    deactive(){
        this.isActive = false
    }
    
    updateEnemys(playersGameId,position){
        playersGameId.forEach(id => {
            // return if player Game id is for this user
            if ( id == this.selfGameId ){ return }

            // return if player Game id already exsit
            else if ( this.playersObject[id] ){ return }

            // create new enemy
            const newEnemy = this.charaterModel.clone()
            this.group.add(newEnemy)

            // we have 3 state on enemy player game info
            // state : good == ping is less than 100
            // state : bad  == pnig is less than 500
            // state : dc   == last gameinfo is more than 500 ms
            this.playersObject[id] = {
                model : newEnemy,
                gameInfo : { 
                    state : "good",
                    min : position,
                    max : position,
                    oldMax : []
                }
            }
        })
    }
    
    playerLeave(playerGameId){
        this.group.remove(this.playersObject[playerGameId].model)
        delete this.playersObject[playerGameId]
    }
    
    // update position from server
    updateGameInfo(time ,gameInfo){
        const timeNow = this.getClock() - 200

        Object.keys(this.playersObject).forEach(id => {
            if ( id == this.selfGameId ) { return }
            
            const playerInfo = this.playersObject[id]
            const info = gameInfo[id]

            if (info.t >  timeNow ){
                playerInfo.gameInfo.state = "good"
                if ( info.t > playerInfo.gameInfo.max.t ){
                    playerInfo.gameInfo.oldMax.push(playerInfo.gameInfo.max)
                    playerInfo.gameInfo.max = info


                    let smalletsTime = playerInfo.gameInfo.min.t
                    for (let index = playerInfo.gameInfo.oldMax.length -1 ; index > -1 ; index--) {
                        if ( timeNow > playerInfo.gameInfo.oldMax[index].t ) {
                            if (playerInfo.gameInfo.oldMax[index].t > smalletsTime ){
                                playerInfo.gameInfo.min = playerInfo.gameInfo.oldMax[index]
                                smalletsTime = playerInfo.gameInfo.oldMax[index].t
                            } else {
                                playerInfo.gameInfo.oldMax.splice(index,1)
                            }
                        }
                    }
                }
            } else if ( info.t >  timeNow - 400 ){
                    
                playerInfo.gameInfo.state = "bad"
                playerInfo.gameInfo.min = info

            } else {
                playerInfo.gameInfo.state = "dc"
                playerInfo.gameInfo.min = info
            }
        })
    }

    updatePosition(delta){
        
        if ( !this.isActive ) { return }

        const timeNow = this.getClock() - 200

        // rotate big Spase shipModels
        const positionY =  Math.sin(timeNow / 1000) * 5 
        const rotationY = delta / 1000

        this.baloons.rotation.y += rotationY / 8
        this.baloon1.rotation.y  += rotationY
        this.baloon2.rotation.y  += rotationY
        this.baloon1.position.y  = positionY - 5
        this.baloon2.position.y  = positionY - 5



        Object.keys(this.playersObject).forEach(id => {

            const player = this.playersObject[id]
            const min = player.gameInfo.min

            if ( player.gameInfo.state == "good" ){
                const max = player.gameInfo.max

                // create position base on min max
                // we deside base on dis formolu => px = p1 + tan(alpha) * deltaT
                const deltaTC = (timeNow - min.t) / (max.t - min.t)

                player.model.position.x = min.px + ( max.px - min.px ) * deltaTC
                player.model.position.z = min.pz + ( max.pz - min.pz ) * deltaTC
                player.model.rotation.y = min.ry + ( max.ry - min.ry ) * deltaTC

            } else {
                // player disconnect
                player.model.position.x = min.px
                player.model.position.z = min.pz
                player.model.rotation.y = min.ry
            }

        })
    }
}