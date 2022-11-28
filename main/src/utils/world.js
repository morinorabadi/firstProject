import * as THREE from 'three'

export default class World
{
    constructor(){
        this.scene = new THREE.Scene()

    }

    createStar(count,size){
        // stars
        const distance = 24
        const vertexes = new Float32Array(count*3)
        for ( let i = 0; i < count; i++ ){
            const vertex = new THREE.Vector3(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
            ).normalize()

            vertexes[i*3 + 0] = vertex.x  *  10
            vertexes[i*3 + 1] = vertex.y  *  10
            vertexes[i*3 + 2] = vertex.z  *  10
        }
        
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position", new THREE.BufferAttribute(vertexes,3))
        
        const material = new THREE.PointsMaterial({
            color : "#fff",
            size : size,
        })
        const starts = new THREE.Points(geometry,material)
        this.scene.add(starts)
    }
}