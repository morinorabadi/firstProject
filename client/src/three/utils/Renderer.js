import * as THREE from 'three'

export default class Renderer
{
    constructor(redlibcore,scene,camera){
        // store params
        this.scene = scene
        this.camera = camera

        // setup rendere
        this.renderer = new THREE.WebGLRenderer({canvas : document.getElementById('canvasMain')})
        this.renderer.setSize(window.innerWidth,window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setClearColor(new THREE.Color("#111"))

        // add events
        redlibcore.globalEvent.addCallBack("process", () => {this.render()})
        redlibcore.globalEvent.addCallBack("resize", (sizes) => {this.resize(sizes)})
    }

    // handele resize event
    resize(sizes){
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // render function
    render(){
        this.renderer.render(this.scene,this.camera)
    }
}