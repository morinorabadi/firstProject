import * as THREE from 'three'

export default class Renderer
{
    constructor(scene,camera){
        this.scene = scene
        this.camera = camera
        this.renderer = new THREE.WebGLRenderer({canvas : document.querySelector('canvas')})
        this.renderer.setSize(window.innerWidth,window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setClearColor(new THREE.Color("#121212"))
    }
    resize(sizes){

    }
    render(){
        this.renderer.render(this.scene,this.camera)
    }
}