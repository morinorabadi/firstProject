import { getSocketEvent, socketEmit } from '../connection/Socket'
import { getRedLibCore } from '../redlibCore/core'

import * as THREE from 'three'

import World from './world/world'
import Renderer from './utils/Renderer'
import AssetsLoader from './utils/AssetsLoader'

import Character from './character/3DCharacter'

import Enemy from './character/Enemy'


export default class Scene
{
  constructor(){
    console.log("scene constructor");

    const redlibcore = getRedLibCore()
    const socketEvents = getSocketEvent()
    
    let world;
    let renderer;
    let character;
    let enemys;
    
    let loadedModels = {}

    let isLoadOver = false
    let isLoadStart = false
    this.load = ( loadOverCallBack ) => {
        
        // prevent from multiple load task
        if ( isLoadStart ){ return }
        isLoadStart = true

        new AssetsLoader().load({
            loadOver : () => {
                // load over event
                isLoadOver = true
                console.log("load os over in scene");
                loadOverCallBack()

            },
            objects : [

                {type : "gltf"   , src : "assets/models/ballon.glb",       loadOver : gltf    => {
                    gltf.scene.traverse( child => { if ( child.material ) {
                        if( child.material.map ){
                            child.material.map.flipY = false
                        }
                            
                        child.material.metalness = 0
                    } } );
                    
                    loadedModels.ballon = gltf.scene
                }},

                {type : "gltf"   , src : "assets/models/bigSpaceShip.glb", loadOver : gltf    => {
                    gltf.scene.traverse( child => { if ( child.material ) {
                        if( child.material.map ){
                            child.material.map.flipY = false
                        }
                            
                        child.material.metalness = 0
                    } } );
                    
                    loadedModels.bigSpaceShip = gltf.scene
                }},

                {type : "gltf"   , src : "assets/models/spaceShip.glb",    loadOver : gltf    => {
                    gltf.scene.traverse( child => { if ( child.material ) {
                        if( child.material.map ){
                            child.material.map.flipY = false
                        }
                            
                        child.material.metalness = 0
                    }});
                    loadedModels.spaceShip = gltf.scene
                }},

                // spaceShip audio
                {type : "audio"  , src : "assets/audios/spaceShip.mp3", loadOver : audio   => {
                    loadedModels.spaceShipAudio = audio
                }},

                // big spaceship sound 
                {type : "audio"  , src : "assets/audios/tuesday.mp3", loadOver : audio   => {
                    loadedModels.bigSpaceShipAudio = audio
                }}
            ]
        })
    }

    function waitUntilLoadOver(){
        let loopId;
        return new Promise((resolve,_) => {
            loopId = setInterval(() => {
                if ( isLoadOver ){
                    clearInterval(loopId)
                    resolve()
                }
            },100)
        })
    }

    // generate world
    socketEvents.addCallBack("createWorld", async (response) => {
        console.log("createWorld in scene")
        if ( response.status == 200 ){

            if (!isInitDone){
                await waitUntilLoadOver()
                initScene()
            }

            // create world
            world.generateBase(response.baseWorldData)

            // store self playerGameId
            character.playerGameId = response.playerGameId

            // create enemys class
            enemys.init(response.playerGameId)

            socketEmit("load-over", Date.now())
        }
    })

    let isInitDone = false
    function initScene() {
        // prevent from init before loading
        console.log("load over is ",isLoadOver);
        if (!isLoadOver){
            console.error("game init is calling before load over")
            return
        }

        // prevent from multiple init
        if ( isInitDone ){
            console.error("we cant init scene twice");
            return
        }
        isInitDone = true

        // create world
        world = new World(redlibcore,loadedModels)

        // create character
        character = new Character(redlibcore , loadedModels)
        world.scene.add(character.group)

        // create enemy class
        enemys = new Enemy(redlibcore, loadedModels)
        world.scene.add(enemys.group)

        // setup renderer
        renderer = new Renderer(redlibcore, world.scene, character.camera)

        // start game event
        socketEvents.addCallBack("startGame", ( response ) => {
            document.getElementById('scene').style.display = "block"
            character.active(response.position)
            renderer.active()
            enemys.active()
            redlibcore.sizes.resize()
        })

    }
        
    // server room destroyed
    socketEvents.addCallBack("roomDestroyed",( response )=>{

        document.getElementById('scene').style.display = "none"
        character.deActive()
        renderer.deActive()
        enemys.deActive()
        socketEmit("room-destroyed-done")
    })


  }
}
