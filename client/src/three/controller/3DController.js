import * as THREE from 'three'
import InputConverter from '../../redlibCore/utils/InputConverter'

const html = `
<div id="contoroller">
            
<svg id="joy" viewBox="0 0 400 400">
    <circle class="big" cx="200" cy="200" r="100" />
    <circle class="small" cx="200" cy="200" r="70" />
</svg>

<svg id="speed"  viewBox="0 0 100 200">
    <rect width="40" height="100" x="38" y="50" rx="18" ry="18" />
    <circle r="18" cx="58" cy="110" />
</svg>

</div>
`
const sass = `
#joy
    background: #f003
    position: fixed
    left: 0
    
    .big
        fill : rgba(0,0,0,0.4)
    .small
        fill : rgba(0,0,0,0.6)

#speed
    background: #0f03
    position: fixed
    right: 0
    top: 0

    circle
        fill : rgba(0,0,0,0.6)
    rect
        fill : rgba(0,0,0,0.4)
        stroke: #fff9
        stroke-width: 3px
`

export default class Controller
{
    constructor(redlibcore, getDirection, getSpeed ,end){
        // events
        this.getDirection = getDirection
        this.getSpeed = getSpeed
        this.end = end

        // global events
        redlibcore.globalEvent.addCallBack("resize", (sizes) => {this.resize(sizes)})
        redlibcore.globalEvent.addCallBack("process", (delta) => {this.process(delta)})

        // adding keyboard events
        this.keyBoardRightInfo = { isActive : false, left : false, right : false, x : 0 , lastActiveState : false }
        this.keyBoardUpInfo =    { isActive : false, up : false, down : false   , y : 0 , lastActiveState : false }
        this.keyBoardSpeedInfo = { isActive : false, spase : true, shiftt : false }
        
        this.keyboardDirection = new THREE.Vector2()
        document.addEventListener('keydown',( event ) => { this.KeyBoardControll(event,true)})
        document.addEventListener('keyup',( event ) => { this.KeyBoardControll(event,false)})

        // touch events
        redlibcore.globalEvent.addCallBack("touchStart", (touch) => { this.touchStart(touch) })
        redlibcore.globalEvent.addCallBack("touchDrag", (touch) => { this.touchDrag(touch) })
        redlibcore.globalEvent.addCallBack("touchEnd", () => { this.touchEnd() })

        // joy 
        this.joy = document.querySelector('#joy')
        this.big = document.querySelector('#joy .big')
        this.small = document.querySelector('#joy .small')
        this.joyConverter = new InputConverter(this.joy)

        this.position = new THREE.Vector2()
        
        // speed
        this.speed = document.querySelector('#speed')
        this.button = document.querySelector('#speed circle')
        this.speedConverter = new InputConverter(this.speed)

        this.speedTouchY = 0
        this.speedTouchYPorpos = 110
        this.speedTouchYCurrent = 110


        this.isEngineOn = false
        this.isForward = true
        
        // resize in the end
        this.resize({x : window.innerWidth, y : innerHeight})
    }

    active(){
        document.getElementById('contoroller').style.display = "block"
        this.isActive = true
    }
    deActive(){
        document.getElementById('contoroller').style.display = "none"
        this.isActive = false
    }


    process(delta){
        if ( !this.isActive ) { return }

        if (this.speedAutoRender){
            if ( Math.abs(this.speedTouchYPorpos - this.speedTouchYCurrent) < 0.01 ){
                this.speedAutoRender = false
                this.speedTouchYCurrent = this.speedTouchYPorpos
                this.button.setAttribute('cy', this.speedTouchYPorpos)
            } else {
                this.speedTouchYCurrent += (this.speedTouchYPorpos - this.speedTouchYCurrent )* 0.1
                this.button.setAttribute('cy', this.speedTouchYCurrent)
            }
            
        }

        if ( this.joyAutoRender ){
    
            if (Math.abs(this.position.x) + Math.abs(this.position.y) < 0.02) {
                this.joyAutoRender = false
                this.small.setAttribute('cy', 200)
                this.small.setAttribute('cx', 200)     
                // this.getDirection(new THREE.Vector2())
                return           
            } 
            this.position.multiplyScalar(0.92)
            // this.getDirection(this.position.clone())
            this.small.setAttribute('cy', this.position.y * 200 + 200)
            this.small.setAttribute('cx', this.position.x * 200 + 200)

        }

    }

    resize(sizes){
        if ( sizes.x > sizes.y ){

            this.joy.style.top =  sizes.y * 0.38
            this.joy.style.width =  sizes.y * 0.62
            
            this.speed.style.height = sizes.y * 0.62
            this.speed.style.top =  sizes.y * 0.38
            
        } else {
            const lorem = sizes.x * 10 / 16
            this.joy.style.top =  sizes.y - lorem
            this.joy.style.width =  lorem
            
            this.speed.style.height = lorem
            this.speed.style.top =  sizes.y - lorem

        }

        this.joyConverter.resize()
        this.speedConverter.resize()

    }
    /**
     * KeyBoard
     */

    // handle keyboard events 
    KeyBoardControll(event,isDown){
        if ( !this.isActive ) { return }

        // check witch key is pressed or release
        switch (event.code) {
            // up and down
            case 'KeyW' :
            case 'ArrowUp':

                this.keyBoardUpInfo.up = isDown
                break;

            case 'KeyS':
            case 'ArrowDown':

                this.keyBoardUpInfo.down = isDown
                break;

            // left and right
            case 'KeyA':
            case 'ArrowLeft':

                this.keyBoardRightInfo.left = isDown
                break;

            case 'KeyD':            
            case 'ArrowRight':

                this.keyBoardRightInfo.right = isDown
                break;

            // -----------------------------------
            case 'Space':
            case 'ShiftLeft':
                // prevent from key_up
                if ( !isDown ){return}
                
                if ( this.isEngineOn ){
                    if ( !this.isForward && event.code == "Space" ){
                        this.isForward = true
                    } else if ( this.isForward && event.code == "ShiftLeft" ){
                        this.isForward = false
                    } else {
                        this.isEngineOn = false
                    }
                } else {
                    if ( event.code == "Space" ) { 
                        this.isForward = true
                    } else {
                        this.isForward = false
                    }
                    this.isEngineOn = true
                }

                this.getSpeed(this.isEngineOn,this.isForward)
                this.speedButtonRender()
                break;
        }
        

        // handle up or down direction
        if (this.keyBoardSpeedInfo.spase && this.keyBoardSpeedInfo.shiftt ){
                this.isEngineOn = false
                this.isForward = true
        } else if ( this.keyBoardSpeedInfo.up ) {
            speed = 1
        } else if ( this.keyBoardSpeedInfo.down ) {
            speed = -0.5
        }



        // handle left or right direction
        this.keyBoardRightInfo.lastActiveState = this.keyBoardRightInfo.isActive
        if (this.keyBoardRightInfo.left && this.keyBoardRightInfo.right){   
            this.keyBoardRightInfo.x = 0
            this.keyBoardRightInfo.isActive = false

        } else if ( this.keyBoardRightInfo.left ) {
            this.keyBoardRightInfo.x = -1
            this.keyBoardRightInfo.isActive = true

        } else if ( this.keyBoardRightInfo.right ) {
            this.keyBoardRightInfo.x = 1
            this.keyBoardRightInfo.isActive = true

        } else {
            this.keyBoardRightInfo.x = 0
            this.keyBoardRightInfo.isActive = false

        }

        // handle up or down direction
        this.keyBoardUpInfo.lastActiveState = this.keyBoardUpInfo.isActive
        if (this.keyBoardUpInfo.up && this.keyBoardUpInfo.down){   
            this.keyBoardUpInfo.y = 0
            this.keyBoardUpInfo.isActive = false

        } else if ( this.keyBoardUpInfo.up ) {
            this.keyBoardUpInfo.y = -1
            this.keyBoardUpInfo.isActive = true

        } else if ( this.keyBoardUpInfo.down ) {
            this.keyBoardUpInfo.y = 1
            this.keyBoardUpInfo.isActive = true

        } else {
            this.keyBoardUpInfo.y = 0
            this.keyBoardUpInfo.isActive = false

        }

        // calculate send out or not
        if ( !this.keyBoardUpInfo.isActive && !this.keyBoardRightInfo.isActive ){
            let callEnd = false

            if (!this.keyBoardUpInfo.isActive && this.keyBoardUpInfo.lastActiveState ){
                callEnd = true
            }

            if (!this.keyBoardRightInfo.isActive && this.keyBoardRightInfo.lastActiveState ){
                callEnd = true
            }
            
            if ( callEnd ){
                this.end()
            }
            
            !this.keyBoardRightInfo.isActive
        } else {
            this.getDirection(new THREE.Vector2(
                this.keyBoardRightInfo.x,
                this.keyBoardUpInfo.y
            ))
        }



    }

    /**
     * Touch
     */
    touchStart(touch){
        if ( !this.isActive ) { return }

        // speed
        const speedTouch = this.speedConverter.convert(touch)
        if ( speedTouch.x < -0.75 || speedTouch.y > 0.75 ||speedTouch.y <  -0.75 ){
            this.speedAlowDrag = false
        } else {
            this.speedAlowDrag = true
            this.speedAutoRender = false
        }

        //joy
        const joyTouch = this.joyConverter.convert(touch)
        if ( joyTouch.x > 0.75 || joyTouch.y > 0.75 ||joyTouch.y <  -0.75 ){
            this.joyAlowDrag = false
        } else {
            this.joyAlowDrag = true
            this.joyAutoRender = false
        }
    }

    touchDrag(touch){
        // speed
        if (this.speedAlowDrag){
            this.speedTouchY = this.speedConverter.convert(touch).y - 0.1
            if (this.speedTouchY < -0.4) {
                this.speedTouchY = -0.4
            } else if ( this.speedTouchY > 0.2){
                this.speedTouchY = 0.2
            }
            this.speedTouchYCurrent = this.speedTouchY * 100 + 110
            this.button.setAttribute('cy', this.speedTouchYCurrent)
        }


        // joy
        if (this.joyAlowDrag){ 

            const joyTouch = this.joyConverter.convert(touch)
            this.position.set(joyTouch.x, joyTouch.y)
            if (this.position.distanceToSquared(new THREE.Vector2()) > 0.3){
                this.position.normalize().multiplyScalar(0.56)
            }
            this.getDirection(this.position.clone())
            // this.position.multiplyScalar(200)

            this.small.setAttribute('cy', this.position.y * 200 + 200)
            this.small.setAttribute('cx', this.position.x * 200 + 200)
        }
    }

    touchEnd(){
        if ( this.speedAlowDrag ) {
            if ( this.speedTouchY < -0.2 ){
                this.isEngineOn = true
                this.isForward = true
            } else if ( this.speedTouchY > 0.1 ){
                this.isEngineOn = true
                this.isForward = false
            } else {
                this.isEngineOn = false
                this.isForward = false
            }
            this.getSpeed(this.isEngineOn, this.isForward)
            this.speedButtonRender()
        }
        this.joyAutoRender = true
        if (this.joyAlowDrag){
            this.end()
        }
    }

    speedButtonRender(){
        if ( this.isEngineOn ){
            if ( this.isForward ) {
                this.speedTouchYPorpos = 70
            } else {
                this.speedTouchYPorpos = 130
            }
        } else {
            this.speedTouchYPorpos = 110
        }
        this.speedAutoRender = true
    }

}


