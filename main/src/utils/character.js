import * as THREE from 'three'
import { lerp } from 'three/src/math/MathUtils'

import gsap from 'gsap'

export default class Charater
{
    constructor(assetsLoader,redlibcore,audioClass){
        this.group = new THREE.Group()
        this.charater = new THREE.Group() 
        this.isActive = false
        assetsLoader.load({
            loadOver : () => {

            },
            objects : [
                {type : "audio"  , src : "assets/audios/spaseShip.mp3", loadOver : audio   => {
                    this.audio = audio
                    this.audio._loop = true
                    this.audio.volume(0.4)
                    this.audio.rate(0.8)
                    this.audio.play()
                } },
                {type : "gltf"   , src : "/assets/spaseShip.glb", loadOver : gltf    => {
                    this.charater.add(gltf.scene)
                    this.group.add(this.charater)
                    setInterval( () => {
                        const targrt = new THREE.Vector3()
                        this.charater.getWorldPosition(targrt)
                        audioClass.updatePosition("character",targrt)
                        
                    }, 250)
                    gltf.scene.children.forEach( mesh => {
                        mesh.material = new THREE.MeshBasicMaterial({ color : 'red' })
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
        this.cameraGroup = new THREE.Group()
        this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 1, 700)
        this.cameraGroup.add(this.camera)
        this.group.add(this.cameraGroup)
        this.camera.position.set(10,1,-1.5)
        this.camera.lookAt(new THREE.Vector3(0,0,0))
        
        // adding process event for update position
        redlibcore.globalEvent.addCallBack('process', (delta) => { this.updatePosition(delta) })

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


    resize(sizes){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    setDirection(direction){
        this.moveInfo.direction = direction
        this.moveInfo.isActive = true
        
    }
    setDirectionEnd(){
        this.moveInfo.isActive = false
    }

    updatePosition(delta){
        if (!this.isActive) { return }
        // increse speed for smoth movement
        if ( this.moveInfo.isActive ){
            this.moveInfo.forseMove = true
            if ( this.moveInfo.speed < this.moveInfo.maxSpeed ) {
                this.moveInfo.speed += delta * 0.00002
                this.audio.volume((this.moveInfo.speed * 55) + 0.4)
                this.audio.rate((this.moveInfo.speed * 40) + 0.8)
            }
        } else if (this.moveInfo.forseMove) {
            if (  this.moveInfo.speed > 0 ) {
                this.moveInfo.speed -= delta * 0.00001
                this.audio.volume((this.moveInfo.speed * 40) + 0.4)
                this.audio.rate((this.moveInfo.speed * 40) + 0.8)
            } else {
                this.moveInfo.forseMove = false
            }
        }

        // actuall charechter move base on speed

        if ( this.moveInfo.forseMove ) {

            const direction = this.moveInfo.direction.clone()
            direction.x = -direction.x

            this.moveInfo.CameraRotate += direction.x * delta * this.moveInfo.speed * 0.2
            this.cameraGroup.rotation.y = lerp(this.moveInfo.CameraRotate,this.cameraGroup.rotation.y,0.85)
            this.charater.rotation.y = lerp(this.moveInfo.CameraRotate,this.charater.rotation.y,0.4)

            const direction1 = this.moveInfo.direction.clone()
            direction1.rotateAround( new THREE.Vector2(), this.cameraGroup.rotation.y )

            this.group.position.x -= delta * this.moveInfo.speed * direction1.x
            this.group.position.z += delta * this.moveInfo.speed * direction1.y

        }

    }
}