import * as THREE from 'three'
import { lerp } from 'three/src/math/MathUtils'

import gsap from 'gsap'

export default class Charater
{
    constructor(assetsLoader,redlibcore,audioClass){
        this.group = new THREE.Group()
        this.charater = new THREE.Group() 
        this.isActive = false

        // loading information
        assetsLoader.load({
            loadOver : () => {

            },
            objects : [
                // spaseShip audio
                {type : "audio"  , src : "assets/audios/spaseShip.mp3", loadOver : audio   => {
                    this.audio = audio
                    this.audio._loop = true
                    this.audio.volume(0.3)
                    this.audio.rate(0.8)
                    this.audio.play()
                } },
                // charater 3m model 
                {type : "gltf"   , src : "/assets/spaseShip.glb", loadOver : gltf    => {
                    this.charater.add(gltf.scene)
                    this.group.add(this.charater)

                    // send out world position every 200 milisecends
                    setInterval( () => {
                        const targrt = new THREE.Vector3()
                        this.charater.getWorldPosition(targrt)
                        audioClass.updatePosition("character",targrt)
                        
                    }, 200)
                    gltf.scene.children.forEach( mesh => {

                        // adding material to 3d model 
                        switch (mesh.name) {
                            case "black":
                                mesh.material = new THREE.MeshStandardMaterial({ color : '#222' })
                                break;

                            case "white":
                                mesh.material = new THREE.MeshStandardMaterial({ color : '#ccc' })
                                break;

                            case "blue":
                                mesh.material = new THREE.MeshStandardMaterial({ color : '#12a4ff' })
                                break;
                        }
                    });
                } }
            ]
        })

        // setup camera and camera group
        this.cameraGroup = new THREE.Group()
        this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 1, 700)
        this.cameraGroup.add(this.camera)
        this.group.add(this.cameraGroup)
        this.camera.position.set(10,1,-1.5)
        this.camera.lookAt(new THREE.Vector3(0,0,0))
        
        // adding process event for update position
        redlibcore.globalEvent.addCallBack('process', (delta) => { this.updatePosition(delta) })

        // store every inforamtion about move
        this.moveInfo = {
            isActive : false,
            direction : new THREE.Vector2(),

            forseMove : false,
            speed : 0,
            maxSpeed : 0.01,

            CameraRotate : Math.PI / 2,
        }

        this.group.position.set(220,0,0)

    }

    // active inputs and do first animation
    active(){
        this.isActive = true
        gsap.to( this.camera.position , { 
            duration : 1,
            x : 0,
            y : 3 ,
            z : 10,
            onUpdate : () => {
                this.camera.lookAt(this.group.position)
                this.cameraGroup.rotation.y = lerp(this.moveInfo.CameraRotate,this.cameraGroup.rotation.y,0.85)
                this.charater.rotation.y = lerp(this.moveInfo.CameraRotate,this.charater.rotation.y,0.4)
            }
            })
        gsap.to( this.group.position, { 
            duration : 1,
            x : 150,
        })
    }

    // handele resize events
    resize(sizes){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    // store inputs from controll calss
    setDirection(direction){
        this.moveInfo.direction = direction
        this.moveInfo.isActive = true
        
    }

    // call this event when input is over
    setDirectionEnd(){
        this.moveInfo.isActive = false
    }

    // handele input events
    updatePosition(delta){
        // chech if this section is active
        if (!this.isActive) { return }

        // handele speed of spaseShip
        if ( this.moveInfo.isActive ){
            this.moveInfo.forseMove = true
            if ( this.moveInfo.speed < this.moveInfo.maxSpeed ) {
                // increse speed for smoth movement
                this.moveInfo.speed += delta * 0.00002

                // handele spaseShip audio base on speed
                this.audio.volume((this.moveInfo.speed * 55) + 0.3)
                this.audio.rate((this.moveInfo.speed * 40) + 0.8)
            }
        } else if (this.moveInfo.forseMove) {
            if (  this.moveInfo.speed > 0 ) {
                // decrese speed for smoth movement
                this.moveInfo.speed -= delta * 0.00001

                // handele spaseShip audio base on speed
                this.audio.volume((this.moveInfo.speed * 40) + 0.3)
                this.audio.rate((this.moveInfo.speed * 40) + 0.8)
            } else {
                this.moveInfo.forseMove = false
            }
        }

        // actuall charechter move base on speed
        if ( this.moveInfo.forseMove ) {

            const direction = this.moveInfo.direction.clone()
            direction.x = -direction.x

            // store CameraRotate
            this.moveInfo.CameraRotate += direction.x * delta * this.moveInfo.speed * 0.2

            // rotate camera and charater
            this.cameraGroup.rotation.y = lerp(this.moveInfo.CameraRotate,this.cameraGroup.rotation.y,0.85)
            this.charater.rotation.y = lerp(this.moveInfo.CameraRotate,this.charater.rotation.y,0.4)

            // move charater base on "CameraRotate" and "speed"
            const direction1 = this.moveInfo.direction.clone()
            direction1.rotateAround( new THREE.Vector2(), this.cameraGroup.rotation.y )

            this.group.position.x -= delta * this.moveInfo.speed * direction1.x
            this.group.position.z += delta * this.moveInfo.speed * direction1.y

        }

    }
}