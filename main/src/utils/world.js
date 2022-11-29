import * as THREE from 'three'

export default class World
{
    constructor(assetsLoader,redlibcore){
        // main scene
        this.scene = new THREE.Scene()
        
        this.isActive = false

        // create group for planets
        this.planets = new THREE.Group()
        this.scene.add(this.planets)
        this.planetGenerator()

        // create group for starts
        this.stars = new THREE.Group()
        this.scene.add(this.stars)


        this.createLight()

        // load sun texture and create sun it self
        assetsLoader.load({
            loadOver : () => {},
            objects : [
                {type : "texture", src : "assets/sun.jpeg", loadOver : texture => { 
                    texture.wrapS = THREE.RepeatWrapping
                    texture.wrapT = THREE.RepeatWrapping
                    texture.repeat.set( 4, 4 )
                    this.scene.add(
                        new THREE.Mesh(
                            new THREE.SphereGeometry(6,64,64), 
                            new THREE.MeshBasicMaterial({ color : '#ffbc57', map : texture })
                        )
                    )
                 } },
            ]
        })

        // add process evet dor rotate planet an stars
        redlibcore.globalEvent.addCallBack('process', (delta) => { this.process(delta) })


    }
    active(){
        this.isActive = true
    }
    process(delta){
        if ( !this.isActive ){
            this.stars.rotation.y -= delta * 0.0005
        }
        this.earch.rotation.y += delta * 0.0001
        this.mars.rotation.y -= delta * 0.00015
        this.venus.rotation.y += delta * 0.0002
        this.mercury.rotation.y -= delta * 0.00022
    }

    // add some light
    createLight(){
        const ambientLight = new THREE.AmbientLight("#bdfff0",0.5)

        const sun = new THREE.PointLight('#fffd7d', 1, 150,1.5)

        const directionalLight = new THREE.DirectionalLight("#fff",0.4)
        directionalLight.position.set(1,1,1 )
        
        this.scene.add(sun,ambientLight,directionalLight)
    }

    // Planet generator
    planetGenerator(){
        this.earch = new THREE.Group()
        const earchMesh = new THREE.Mesh( 
            new THREE.SphereGeometry(3,32,32),
            new THREE.MeshStandardMaterial({
                color : '#17fff7',
            })
        )
        earchMesh.position.set(25,0,0)

        this.earch.add(earchMesh)
        this.planets.add(this.earch)

        this.mercury = new THREE.Group()
        const mercuryMesh = new THREE.Mesh( 
            new THREE.SphereGeometry(1,32,32),
            new THREE.MeshStandardMaterial({
                color : '#ff9317',
            })
        )
        mercuryMesh.position.set(10,4,0)

        this.mercury.add(mercuryMesh)
        this.planets.add(this.mercury)

        this.mars = new THREE.Group()
        const marsMesh = new THREE.Mesh( 
            new THREE.SphereGeometry(6,32,32),
            new THREE.MeshStandardMaterial({
                color : '#ff9317',
            })
        )
        marsMesh.position.set(50,-5,0)

        this.mars.add(marsMesh)
        this.planets.add(this.mars)

        this.venus = new THREE.Group()
        const venusMesh = new THREE.Mesh( 
            new THREE.SphereGeometry(5,32,32),
            new THREE.MeshStandardMaterial({
                color : '#96fff3',
            })
        )
        venusMesh.position.set(75,-5,0)

        this.venus.add(venusMesh)
        this.planets.add(this.venus)
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

            vertexes[i*3 + 0] = vertex.x  *  180  * (Math.random() * 0.2  + 0.8 ) 
            vertexes[i*3 + 1] = vertex.y  *  60  * (Math.random() * 0.2  + 0.8 )
            vertexes[i*3 + 2] = vertex.z  *  180  * (Math.random() * 0.2  + 0.8 )
        }
        
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position", new THREE.BufferAttribute(vertexes,3))
        
        const material = new THREE.PointsMaterial({
            color : color,
            size : size,
        })

        this.stars.add(new THREE.Points(geometry,material))
    }
}