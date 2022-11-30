import * as THREE from 'three'

export default class World
{
    constructor(assetsLoader,redlibcore,audioClass){
        // main scene
        this.scene = new THREE.Scene()
        
        // for active events
        this.isActive = false

        // create group for planets
        this.planets = new THREE.Group()
        this.scene.add(this.planets)
        this.createplanet(audioClass)

        // create group for starts
        this.stars = new THREE.Group()
        this.scene.add(this.stars)

        // add light to scene
        this.createLight()

        // loading information
        assetsLoader.load({
            loadOver : () => {},
            objects : [

                // sun texture and create sun
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
                }},

                // background audio
                {type : "audio"  , src : "assets/audios/section1.mp3", loadOver : audio   => {
                    audio._loop = true;
                    audio.play()
                    audio.volume(0.4)
                }},
            ]
        })

        // add process event for rotate planet and stars
        redlibcore.globalEvent.addCallBack('process', (delta) => { this.process(delta) })


    }

    // active event
    active(){
        this.isActive = true
    }

    process(delta){
        // rotate stars until active
        if ( !this.isActive ){
            this.stars.rotation.y -= delta * 0.0005
        }

        // rotate planets
        this.earch.rotation.y += delta * 0.00005
        this.mars.rotation.y -= delta * 0.00002
        this.venus.rotation.y += delta * 0.00009
        this.mercury.rotation.y -= delta * 0.00003
    }

    // add some light
    createLight(){
        const ambientLight = new THREE.AmbientLight("#bdfff0",0.5)

        const sun = new THREE.PointLight('#fffd7d', 1, 250,1.5)

        const directionalLight = new THREE.DirectionalLight("#fff",0.4)
        directionalLight.position.set(1,1,1 )
        
        this.scene.add(sun,ambientLight,directionalLight)
    }

    // create planets
    createplanet(audioClass){

        // earch planet --------------------------------------
        this.earth = new THREE.Group()
        const earthMesh = new THREE.Mesh( 
            new THREE.SphereGeometry(5,32,32),
            new THREE.MeshStandardMaterial({color : '#17fff7'})
        )
        earthMesh.position.set(75,-2,0)
        this.earth.add(earthMesh)
        this.planets.add(this.earth)


        // mercury planet --------------------------------------
        this.mercury = new THREE.Group()
        const mercuryMesh = new THREE.Mesh( 
            new THREE.SphereGeometry(2,32,32),
            new THREE.MeshStandardMaterial({color : '#ff9317'})
        )
        mercuryMesh.position.set(50,1,0)
        this.mercury.add(mercuryMesh)
        this.planets.add(this.mercury)


        // mars planet --------------------------------------
        this.mars = new THREE.Group()
        const marsMesh = new THREE.Mesh( 
            new THREE.SphereGeometry(6,32,32),
            new THREE.MeshStandardMaterial({color : '#ff9317'})
        )
        marsMesh.position.set(100,-3,0)
        this.mars.add(marsMesh)
        this.planets.add(this.mars)

        // mercury planet --------------------------------------
        this.venus = new THREE.Group()
        const venusMesh = new THREE.Mesh( 
            new THREE.SphereGeometry(4,32,32),
            new THREE.MeshStandardMaterial({color : '#465c5a'})
        )
        venusMesh.position.set(150,-5,0)
        this.venus.add(venusMesh)
        this.planets.add(this.venus)

        // send out planets world position for audio effect every 200 milisecends
        setInterval(() => {
            
            const earthTraget = new THREE.Vector3()
            earthMesh.getWorldPosition(earthTraget)
            audioClass.updatePosition('earth',earthTraget)

            const mercuryTraget = new THREE.Vector3()
            mercuryMesh.getWorldPosition(mercuryTraget)
            audioClass.updatePosition('mercury',mercuryTraget)
            
            const marsTraget = new THREE.Vector3()
            marsMesh.getWorldPosition(marsTraget)
            audioClass.updatePosition('mars',marsTraget)

        },200)
    }

    // star generator
    createStar(count,size, color){
        // generate stars vertexes
        const vertexes = new Float32Array(count*3)
        for ( let i = 0; i < count; i++ ){
            const vertex = new THREE.Vector3(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
            ).normalize()

            vertexes[i*3 + 0] = vertex.x  *  200  * (Math.random() * 0.2  + 0.8 ) 
            vertexes[i*3 + 1] = vertex.y  *  80  * (Math.random() * 0.2  + 0.8 )
            vertexes[i*3 + 2] = vertex.z  *  200  * (Math.random() * 0.2  + 0.8 )
        }

        // create star geometry
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute("position", new THREE.BufferAttribute(vertexes,3))
        
        // create material
        const material = new THREE.PointsMaterial({
            color : color,
            size : size,
        })

        // add created star to starts group
        this.stars.add(new THREE.Points(geometry,material))
    }
}