import './style.sass'

import gsap from 'gsap'

import Charater from './utils/character'
import World from './utils/world'
import Renderer from './utils/Renderer';
import AssetsLoader from './utils/AssetsLoader'
import Controller from './utils/Controll'

const redlibcore = new redlib.RedLib({fps : 60})



/**
 * create asset loader 
 */
const assetLoader = new AssetsLoader()

/**
 * creating world
 */
const world = new World(assetLoader,redlibcore)


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

// create controller
const controller = new Controller(
    redlibcore,
    (direction) => { charater.setDirection(direction) },
    () => { charater.setDirectionEnd() },
)

/**
 * setup renderer
 */
const renderer = new Renderer(world.scene,charater.camera)

const explorebutton = document.querySelector('.explore')
explorebutton.addEventListener('click', () => {
    gsap.to( explorebutton , { duration : 0.5 , opacity : 0 })
    charater.active()
    world.active()
})


/**
 * adding events
 */
// process event
redlibcore.globalEvent.addCallBack("process", (delta) => {

    // update controll
    // controls.update()

    // render scene
    renderer.render()
})

// resize event
redlibcore.globalEvent.addCallBack("resize", (sizes) => {
    charater.resize(sizes)
    renderer.resize(sizes)
})