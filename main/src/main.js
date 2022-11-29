import './style.sass'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Charater from './utils/character'
import World from './utils/world'
import Renderer from './utils/Renderer';
import AssetsLoader from './utils/AssetsLoader'

console.log("start");

const redlibcore = new redlib.RedLib({})

/**
 * create asset loader 
 */
 const assetLoader = new AssetsLoader()

/**
 * creating world
 */
const world = new World()

// create planet
world.planetGenerator(3, new THREE.Vector3(30,0,0))
world.planetGenerator(2, new THREE.Vector3(0,5,20))
world.planetGenerator(2.5, new THREE.Vector3(-10,3,-20))
// world.planetGenerator(0.8, new THREE.Vector3(5,-2,-6))
// world.planetGenerator(1, new THREE.Vector3(-5,2,6))


// create stars
const startInfo = [
    [5000,0.4,"#fff"],
    [100,0.4,"#e570ff"],
    [1000,0.6,"#f0f"],
    [300,0.5,"#fff"]
]
startInfo.forEach(info => {world.createStar(info[0],info[1],info[2])})

/**
 * create charater
 */
const charater = new Charater(assetLoader,redlibcore)

// add charater to world
world.scene.add(charater.group)

/**
 * setup renderer
 */
const renderer = new Renderer(world.scene,charater.camera)



// testing postion
charater.group.position.set(20,0,0)
charater.camera.position.set(0,20,0)
charater.camera.lookAt(new THREE.Vector3(20,0,0))

/**
 * Helpers
 */

// axesHelper
const axesHelper = new THREE.AxesHelper(50)
world.scene.add( axesHelper )

// controll
// const controls = new OrbitControls( charater.camera, document.body )

/**
 * adding events
 */
// process event
redlibcore.globalEvent.addCallBack("process", (delta) => {
    // charater.group.rotation.y += delta / 5000

    // update controll
    // controls.update()

    // render scene
    renderer.render()
})

// resize event
// redlibcore.globalEvent.addCallBack("resize", (sizes) => {
//     console.log("resize");
//     console.log(sizes);
// })