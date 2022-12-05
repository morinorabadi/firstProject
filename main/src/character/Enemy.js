import * as THREE from 'three'

export default class Enemy
{
    constructor(redlibcore, charater,playerGameId,scene){
        this.group = new THREE.Group()
        scene.add(this.group)

        this.charater = charater.clone()

        this.selfGameId = playerGameId
        this.isActive = false
        this.playersObject = {}
        this.gameInfo = null
        redlibcore.globalEvent.addCallBack('process', (delta) => { this.updatePosition(delta) })

    }
    active(){
        this.isActive = true
    }
    updateEnemys(playersGameId){
        console.log(playersGameId)
        console.log(this.selfGameId);
        playersGameId.forEach(id => {
            if ( id == this.selfGameId ){ return }
            else if ( this.playersObject[id] ){ return }
            const newEnemy = this.charater.clone()
            this.group.add(newEnemy)
            this.playersObject[id] = newEnemy            
        })
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