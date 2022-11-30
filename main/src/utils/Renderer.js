import * as THREE from 'three'

export default class Renderer
{
    constructor(scene,camera){
        // store params
        this.scene = scene
        this.camera = camera

        // setup rendere
        this.renderer = new THREE.WebGLRenderer({canvas : document.querySelector('canvas')})
        this.renderer.setSize(window.innerWidth,window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setClearColor(new THREE.Color("#111"))
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