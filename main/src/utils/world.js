import * as THREE from 'three'

export default class World
{
    constructor(){
        // main scene
        this.scene = new THREE.Scene()

        this.createLight()
    }

    // add some light
    createLight(){
        const ambientLight = new THREE.AmbientLight("#bdfff0",0.3)

        const sun = new THREE.PointLight('#fffd7d', 3, 50, 1.2)
        const sunMesh = new THREE.Mesh(
            new THREE.SphereGeometry(5,64,64), 
            new THREE.MeshBasicMaterial({ color : '#ffbc57' })
        )
        
        const directionalLight = new THREE.DirectionalLight("#fff",0.5)
        directionalLight.position.set(1,1,1 )
        this.scene.add(sun,sunMesh,ambientLight,directionalLight)
    }

    // Planet generator
    planetGenerator(radius,position,color,texture){
        const geometry = new THREE.SphereGeometry(radius,32,32)
        const material = new THREE.MeshStandardMaterial({
            color : 'white',
        })

        if (texture){material.texture = texture}
        if (color){material.color =  new THREE.Color(color)}
        
        const mesh = new THREE.Mesh( geometry, material)
        if (position) {
            mesh.position.set(position.x,position.y,position.z)
        }

        this.scene.add(mesh)

    }

    // star generator
    createStar(count,size, color){
        // stars
        const distance = 24
        const vertexes = new Float32Array(count*3)
        for ( let i = 0; i < count; i++ ){
            const vertex = new THREE.Vector3(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
            ).normalize()

            vertexes[i*3 + 0] = vertex.x  *  100  * (Math.random() * 0.2  + 0.8 ) 
            vertexes[i*3 + 1] = vertex.y  *  100  * (Math.random() * 0.2  + 0.8 )
            vertexes[i*3 + 2] = vertex.z  *  100  * (Math.random() * 0.2  + 0.8 )
        }
        
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position", new THREE.BufferAttribute(vertexes,3))
        
        const material = new THREE.PointsMaterial({
            color : color,
            size : size,
        })
        const starts = new THREE.Points(geometry,material)
        this.scene.add(starts)
    }
}