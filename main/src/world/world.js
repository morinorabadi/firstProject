import * as THREE from 'three'

export default class World
{
    constructor(){
        // main scene
        this.scene = new THREE.Scene()
        
        // for active events
        this.isActive = false

        // add light to scene
        const ambientLight = new THREE.AmbientLight("#bdfff0",0.5)
        const directionalLight = new THREE.DirectionalLight("#fff",0.4)
        directionalLight.position.set(1,1,1 )
        
        this.scene.add(ambientLight,directionalLight)
    }

    // generate base world
    generateBase(baseWorld){
        baseWorld.forEach(world => {
            this.generate(world)
        })
    }

    // generate world base on server info
    generate(world){
        const worldGroup = new THREE.Group()
        worldGroup.add(this.generateplanet(world.planets))
        worldGroup.add(this.generateStar(world.stars))
        worldGroup.position.set(
            world.position.x * 100,
            0,
            world.position.z * 100,
        )
        this.scene.add(worldGroup)
    }

    // create planets
    generateplanet(info){
        const planetsGroup = new THREE.Group()
        info.forEach(planetInfo => {
            const planet = new THREE.Mesh( 
                new THREE.SphereGeometry(5,32,32),
                new THREE.MeshStandardMaterial()
            )
    
            planet.position.set(
                planetInfo.position.x,
                planetInfo.position.y,
                planetInfo.position.z,
            )
            planet.material.color = new THREE.Color(planetInfo.color)
            planetsGroup.add(planet)
        })
        return planetsGroup
    }

    // star generator
    generateStar(info){
        const starsGroup = new THREE.Group()
        info.forEach(star => {
            // generate stars vertexes
            const vertexes = new Float32Array(star.count*3)
    
            for ( let i = 0; i < star.count; i++ ){
                vertexes[i*3 + 0] = (Math.random() - 0.5) * 200
                vertexes[i*3 + 1] = (Math.random() - 1.0) * 100 - 20
                vertexes[i*3 + 2] = (Math.random() - 0.5) * 200
            }
    
            // create star geometry
            const geometry = new THREE.BufferGeometry()
            geometry.setAttribute("position", new THREE.BufferAttribute(vertexes,3))
            
            // create material
            const material = new THREE.PointsMaterial({
                color : '#fff',
                size : star.size /2 ,
            })
            // add created star to starts group
            starsGroup.add(new THREE.Points(geometry,material))
        })
        return starsGroup
    }
}