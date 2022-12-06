import * as THREE from 'three'
import {gsap} from 'gsap'

export default class Enemy
{
    constructor(redlibcore, charater){
        this.group = new THREE.Group()
        this.charaterModel = charater.clone()

        redlibcore.globalEvent.addCallBack('process', (delta) => { this.updatePosition(delta) })

    }
    
    init(playerGameId){
        this.selfGameId = playerGameId
        this.group.clear()
        this.playersObject = {}
        this.gameInfo = null
    }

    active(){
        this.isActive = true
    }

    deactive(){
        this.isActive = false
    }
    
    updateEnemys(playersGameId){
        playersGameId.forEach(id => {
            // return if player Game id is for this user
            if ( id == this.selfGameId ){ return }

            // return if player Game id already exsit
            else if ( this.playersObject[id] ){ return }

            // create new enemy
            const newEnemy = this.charaterModel.clone()
            this.group.add(newEnemy)
            this.playersObject[id] = newEnemy

        })
    }
    
    playerLeave(playerGameId){
        this.group.remove(this.playersObject[playerGameId])
        delete this.playersObject[playerGameId]
    }
    
    updateGameInfo(gameInfo){
        this.gameInfo = gameInfo
    }

    updatePosition(delta){
        if ( !this.isActive ) { return }
        /**
         * for smoth movement enemy always
         * display curent position - 0.1 secend of actuall position 
         */

        // fix smoth position ----------------------------------------------------------------------
        // this.moveInfo.push(pos)

        Object.keys(this.playersObject).forEach(id => {
            this.playersObject[id].position.x = this.gameInfo[id].px
            this.playersObject[id].position.z = this.gameInfo[id].pz
            this.playersObject[id].rotation.y = this.gameInfo[id].ry
        })
    }
}