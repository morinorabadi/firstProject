import * as THREE from 'three'

import World from './world/world'
import Renderer from './utils/Renderer';
import AssetsLoader from './utils/AssetsLoader'
import Controller from './utils/Controll'
import Audios from './utils/audio';

import UserCharater from './character/User';
import Enemy from './character/Enemy'


class Scene{
    constructor(redlibcore){
        this.redlibcore = redlibcore

        this.loadChecks = {
            isWorldLoad : false,
            isCharaterLoad : true
        }

        // create assets loader 
        this.assetLoader = new AssetsLoader()

        // global Audio Class
        // this.globalAudio = new Audios(this.assetLoader)

        // creating world
        this.world = new World(this.assetLoader)

        
        // load charater 3D model
        this.charaterModel = null
        this.assetLoader.load({
            loadOver : () => {
                this.loadHandeler('charater')
            },
            objects : [
                // charater 3m model 
                {type : "gltf"   , src : "assets/spaseShip.glb", loadOver : gltf    => {
                    this.charaterModel = gltf.scene
                    gltf.scene.children.forEach( mesh => {

                        // adding material to 3d model 
                        switch (mesh.name) {
                            case "black":
                                mesh.material = new THREE.MeshStandardMaterial({ color : '#222' })
                                break;

                            case "white":
                                mesh.material = new THREE.MeshStandardMaterial({ color : '#ccc' })
                                break;

                            case "blue":
                                mesh.material = new THREE.MeshStandardMaterial({ color : '#12a4ff' })
                                break;
                        }
                    });
                }},
                // spaseShip audio
                {type : "audio"  , src : "assets/audios/spaseShip.mp3", loadOver : audio   => {
                    this.spaseShipAudio = audio
                }},
                // background audio
                {type : "audio"  , src : "assets/audios/section1.mp3", loadOver : audio   => {
                    audio._loop = true;
                    // audio.play()
                    audio.volume(0.4)
                }}
            ]
        })

        /**
         * server Setup
         */

        // generate world
        socket.on("server-create-world", (respone) => {
            if ( respone.status == 200 ){
                // create world
                this.world.generateBase(respone.baseWorldData)

                // store self playerGameId
                this.charater.playerGameId = respone.playerGameId

                // create enemys class
                this.enemys.init(respone.playerGameId)

                this.loadChecks.isWorldLoad = true
                
                // fix character load chech 
                socket.emit("load-over",this.charater.playerGameId)
                
            }
        })

        // start game event
        socket.on("server-start-game", ( response ) => {
            if ( response.status == 200 ){
                this.charater.active()
                this.enemys.active()
            }
        })

        // server on new player join
        socket.on("game-new-player",( response ) => {
            if ( response.status == 200 ){
                this.enemys.updateEnemys(response.playersGameId)
            }
        })

        // game on some player disconnect
        socket.on("game-player-disconnect",( response ) => {
            if ( response.status == 200 ){
                this.enemys.playerLeave(response.playerGameId)
            }
        })

        // server room destroyed
        socket.on("game-room-destroyed",( response )=>{
            if ( response.status == 200 ){
                this.charater.deactive()
                this.enemys.deactive()
                socket.emit("room-destroyed-done")
            }
        })

        // server update game info  
        socket.on("sugi", (gameInfo) => {
            this.enemys.updateGameInfo(gameInfo)
        })

        

    }
    loadHandeler(section){
        switch (section) {
            case "charater":
                // create user charater
                this.charater = new UserCharater(this.redlibcore,this.charaterModel,this.spaseShipAudio)
                this.world.scene.add(this.charater.group)
                
                // create enemy class
                this.enemys = new Enemy(this.redlibcore,this.charaterModel)
                this.world.scene.add(this.enemys.group)

                // create controller
                this.controller = new Controller(
                    this.redlibcore,
                    (direction) => { this.charater.setDirection(direction) },
                    () => { this.charater.setDirectionEnd() },
                )
                
                // setup renderer
                this.renderer = new Renderer(this.redlibcore,this.world.scene,this.charater.camera)

                // chech load
                this.loadChecks.isCharaterLoad = true

                break;
        }
    }
}

export {
    Scene
}