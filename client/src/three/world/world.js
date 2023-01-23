import * as THREE from 'three'

export default class World
{
    constructor(redlibcore,models){
        // main scene
        this.scene = new THREE.Scene()
        
        // add big Space Ship
        const spaceShipGroup = new THREE.Group()

        const spaceShip = models.bigSpaceShip
        spaceShip.position.y = -5

        const balloons = new THREE.Group()
        
        const ballon1 = models.ballon.clone()
        ballon1.position.x = 30
        balloons.add(ballon1)

        const ballon2 = models.ballon.clone()
        ballon2.position.x = -30
        balloons.add(ballon2)

        spaceShipGroup.add(spaceShip, balloons)
        spaceShipGroup.position.x = -70
        spaceShipGroup.rotation.y = Math.PI / 6

        this.scene.add(spaceShipGroup)

        redlibcore.globalEvent.addCallBack('process', (delta, now) => {
            // rotate big Space shipModels 
            const positionY =  Math.sin(Date.now() / 1000) * 5 
            const rotationY = delta / 1000

            balloons.rotation.y += rotationY / 8
            ballon1.rotation.y  += rotationY
            ballon2.rotation.y  += rotationY
            ballon1.position.y  = positionY - 5
            ballon2.position.y  = positionY - 5
        })


        // add light to scene
        const light =  new THREE.AmbientLight('#fff', 0.8)
        const directionalLight = new THREE.DirectionalLight("#fff",1.2)
        directionalLight.position.set(1,1,1 )
        
        this.scene.add(directionalLight,light)
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
        worldGroup.add(this.generatePlanet(world.planets))
        worldGroup.add(this.generateStar(world.stars))
        
        worldGroup.position.set(
            world.position.x * 100,
            0,
            world.position.z * 100,
        )
        this.scene.add(worldGroup)
    }

    // create planets
    generatePlanet(info){
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