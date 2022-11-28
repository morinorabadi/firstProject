import './style.sass'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Charater from './utils/character'
import World from './utils/world'
import Renderer from './utils/Renderer';

console.log("start");

const redlibcore = new redlib.RedLib({})


// redlibcore.globalEvent.addCallBack("resize", (sizes) => {
//     console.log("resize");
//     console.log(sizes);
// })


// creating world
const world = new World()
world.createStar(5000, 0.1)
// world.createStar(500, 5)
// world.createStar(500, 5)

const axesHelper = new THREE.AxesHelper(50);
world.scene.add( axesHelper );

// create charater
const charater = new Charater()
world.scene.add(charater.group)

// set up renderer
const renderer = new Renderer(world.scene,charater.camera)


// testing postion
charater.camera.position.set(5,5,5)
charater.camera.lookAt(new THREE.Vector3())

// test controll
const controls = new OrbitControls( charater.camera, document.body )

redlibcore.globalEvent.addCallBack("process", (delta) => {
    // console.log("ok");
    charater.group.rotation.y += delta / 5000
    controls.update()
    renderer.render()
})


