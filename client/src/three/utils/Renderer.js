import * as THREE from 'three'

export default class Renderer
{
    constructor(redlibcore,scene,camera){

        this.isActive = false

        // setup renderer
        const renderer = new THREE.WebGLRenderer({canvas : document.getElementById('scene')})
        renderer.setSize(window.innerWidth,window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(new THREE.Color("#111"))

        // add events
        redlibcore.globalEvent.addCallBack("process", () => {
            if (this.isActive){
                renderer.render(scene,camera)
            }
        },0)
        redlibcore.globalEvent.addCallBack("resize", (sizes) => {
            renderer.setSize(window.innerWidth, window.innerHeight)
        })
    }
    active(){
        this.isActive = true
    }
    deActive(){
        this.isActive = false
    }
}