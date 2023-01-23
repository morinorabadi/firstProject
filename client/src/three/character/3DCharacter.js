import Controller from '../controller/3DController'
import { socketVolatileEmit } from '../../connection/Socket'
import * as THREE from 'three'

export default class Character
{
  constructor(redlibcore,models){

    this.group = new THREE.Group()

    /**
     * active and deActive functions
     */
    let isActive = false
    this.playerGameId = null
    this.active = (position) => {
        controller.active()
        engineAudio.play()
        bigSpaceShipAudio.play()
        this.group.position.x = position.px
        isActive = true
    }
    this.deActive = () => {
        controller.deActive()
        engineAudio.pause()
        bigSpaceShipAudio.pause()
        isActive = false
    }

    // camera
    this.camera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.set(0,20,20)
    this.camera.lookAt(new THREE.Vector3(0,0,0))

    const cameraGroup = new THREE.Group()
    
    
    cameraGroup.add(this.camera)
    this.group.add(cameraGroup)

    const character = models.spaceShip
    this.group.add(character)
    
    /**
     * Audio
     */
    const engineAudio = models.spaceShipAudio
    engineAudio._loop = true
    engineAudio.volume(0.4)
    engineAudio.rate(0.75)

    const bigSpaceShipAudio = models.bigSpaceShipAudio
    bigSpaceShipAudio._loop = true
    bigSpaceShipAudio.volume(0.2)


    // speed
    let isEngineOn = false
    let isForward = false

    const maxSpeed = 0.2 
    const maxSpeedBackWard = maxSpeed * -0.75
    const maxDelta = maxSpeed * 0.05

    const deltaSpeed = 0.0001
    let currentSpeed = 0
    let hadSpeed = false


    let direction = new THREE.Vector2()
    let isGettingDirection = false

    const cameraDirectionDelta = 0.001
    const cameraPositionDelta = 0.005

    const controller = new Controller(
        redlibcore,
        (_direction) => {
            isGettingDirection = true
            direction = _direction.normalize().multiplyScalar(-1)
        },

        (_isEngineOn,_isForward) => {
            isEngineOn = _isEngineOn
            isForward = _isForward
        },

        () => {
            console.log("end");
            isGettingDirection = false
        }

    )

    // add global events
    redlibcore.globalEvent.addCallBack("process", (delta,timeNow) => {
        if ( !isActive ) { return }

        // change current speed base on client input
        if ( isEngineOn ){
            if (isForward){
                // increase speed
                if (currentSpeed < maxSpeed){
                    currentSpeed += delta * deltaSpeed
                } else {
                    currentSpeed = maxSpeed
                }
            } else {
                if (currentSpeed > maxSpeedBackWard){
                    currentSpeed -= delta * deltaSpeed
                } else {
                    currentSpeed = maxSpeedBackWard
                } 
            }
            hadSpeed = true
        } else if ( hadSpeed ) {
            currentSpeed +=  delta * deltaSpeed * -Math.sign(currentSpeed)
            if (Math.abs(currentSpeed) < maxDelta){
                hadSpeed = false
                currentSpeed = 0
            }
        }
        

        if ( isGettingDirection ){
            this.group.rotation.y += direction.x * cameraDirectionDelta * delta
            this.group.position.y +=  direction.y * cameraPositionDelta * delta
        }


        // actual character movement
        if ( hadSpeed ){
            
            const engineAudioVolume = Math.abs(currentSpeed/maxSpeed * 0.5)
            console.log(engineAudioVolume);
            engineAudio.volume(engineAudioVolume + 0.4)
            engineAudio.rate(engineAudioVolume + 0.75)

            const currentDirection = new THREE.Vector2(0,-currentSpeed)
            currentDirection.rotateAround(new THREE.Vector2(0,0),-this.group.rotation.y)

            // move character group
            this.group.position.x +=  currentDirection.x
            this.group.position.z +=  currentDirection.y

        }

        // send out data
        socketVolatileEmit({
            px : this.group.position.x,
            py : this.group.position.y,
            pz : this.group.position.z,
            ry : this.group.rotation.y,
            pi : this.playerGameId,
            t  : timeNow,
        })

        // control big space ship audio
        const distanceToSpaceShip = this.group.position.distanceToSquared(new THREE.Vector3(-70, 0, 0))
        if ( distanceToSpaceShip > 10000  ){
            bigSpaceShipAudio.volume(0.2)
        } else if ( distanceToSpaceShip > 2000 ){
            // 8000
            // 1 : 2000 => 0.1 = 10000
            const volume = 1.2 - (distanceToSpaceShip / 10000)
            bigSpaceShipAudio.volume(volume)
        } else {
            bigSpaceShipAudio.volume(1)
        }
    })
  }
}