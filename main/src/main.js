import gsap from 'gsap'

import Charater from './utils/character'
import World from './utils/world'
import Renderer from './utils/Renderer';
import AssetsLoader from './utils/AssetsLoader'
import Controller from './utils/Controll'
import Audios from './utils/audio';


class Scene{
    constructor(redlibcore){
        /**
         * create assets loader 
         */
        this.assetLoader = new AssetsLoader()

        /**
         * global Audio Class
         */
        this.globalAudio = new Audios(this.assetLoader)

        /**
         * creating world
         */
        this.world = new World(this.assetLoader,redlibcore,this.globalAudio)


        // create stars
        const startInfo = [
            [8000,0.5,"#fff"],
            [1000,0.6,"#e570ff"],
            [1000,0.8,"#f0f"],
            [3000,0.5,"#fff"]
        ]
        startInfo.forEach(info => {this.world.createStar(info[0],info[1],info[2])})

        /**
         * create charater
         */
        this.charater = new Charater(this.assetLoader,redlibcore,this.globalAudio)

        // add charater to world
        this.world.scene.add(this.charater.group)

        // create controller
        this.controller = new Controller(
            redlibcore,
            (direction) => { this.charater.setDirection(direction) },
            () => { this.charater.setDirectionEnd() },
        )

        /**
         * setup renderer
         */
        this.renderer = new Renderer(this.world.scene,this.charater.camera)

        // const exploreButton = document.querySelector('.explore')
        // exploreButton.addEventListener('click', () => {
        //     gsap.to( exploreButton , { duration : 0.5 , opacity : 0 })
        //     this.charater.active()
        //     world.active()
        // })


        /**
         * adding events
         */
        // process event
        redlibcore.globalEvent.addCallBack("process", () => {
            // render scene
            this.renderer.render()
        })

        // resize event
        redlibcore.globalEvent.addCallBack("resize", (sizes) => {
            this.charater.resize(sizes)
            this.renderer.resize(sizes)
        })

    }
}

export {
    Scene
}