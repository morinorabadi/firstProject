import * as THREE from 'three'
import { Mesh } from 'three'

export default class Charater
{
    constructor(){
        this.group = new THREE.Group()
        this.charater = new Mesh(
            new THREE.BoxGeometry(),
            new THREE.MeshBasicMaterial({color : 'red'})
        )

        this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 0.1, 500)

        this.group.add(this.charater, this.camera)
    }

    resize(sizes){
        this.camera.aspect = sizes.x /sizes.y 
    }
}