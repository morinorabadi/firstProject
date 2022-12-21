import * as THREE from 'three'

/**
 * this class handele all touch and keyboard events
 * and if customer is try to move fire a callback
 * thats return normalize vector2 direction of input
 * 
 */

export default class Controll
{
    constructor(redlibcore,_event,_eventEnd) {
        this.direction = new THREE.Vector2()
        this.event = _event
        this.eventEnd = _eventEnd
        
        /**
         * KeyBorad
         */
        // store keyboard information
        this.keyBoardInfo = { isActive : false, up : false, down : false, left : false, right : false }

        // adding keyboard events
        document.addEventListener('keydown',( event ) => { this.KeyBoardControll(event,true)})
        document.addEventListener('keyup',( event ) => { this.KeyBoardControll(event,false)})

        /**
         * Touch
         */
        // store touch information
        this.touchInfo = { isActive: false, CurentDrag : null,start : null }

        // adding touch events
        // redlibcore.globalEvent.addCallBack('touchStart', (touch) => { this.touchStart(touch) })
        // redlibcore.globalEvent.addCallBack('touchDrag',  (touch) => { this.touchDrag(touch) })
        // redlibcore.globalEvent.addCallBack('touchEnd',   ()      => { this.touchEnd() })
        
    }

    // handele keyboard events
    KeyBoardControll(event,isDown){
        
        // chech wich key is presed or relese
        switch (event.key) {
            case 'w' :
            case 'ArrowUp':

                this.keyBoardInfo.up = isDown
                break;

            case 's':
            case 'ArrowDown':

                this.keyBoardInfo.down = isDown
                break;

            case 'a':
            case 'ArrowLeft':

                this.keyBoardInfo.left = isDown
                break;

            case 'd':            
            case 'ArrowRight':

                this.keyBoardInfo.right = isDown
                break;
        }

        // handele up or down direction
        if (this.keyBoardInfo.up && this.keyBoardInfo.down){
            this.direction.y = -1
        } else if ( this.keyBoardInfo.up ) {
            this.direction.y = -1
        } else if ( this.keyBoardInfo.down ) {
            this.direction.y = 1
        } else {
            this.direction.y = 0
        }

        // handele left or right direction
        if (this.keyBoardInfo.left && this.keyBoardInfo.right){
            this.direction.x = 0
        } else if ( this.keyBoardInfo.left ) {
            this.direction.x = -1
        } else if ( this.keyBoardInfo.right ) {
            this.direction.x = 1
        } else {
            this.direction.x = 0
        }

        // call input callBack if thres is any direction
        if ( this.direction.x == 0 && this.direction.y == 0){
            if ( this.keyBoardInfo.isActive ) {
                this.callInputEventEnd()
            }
            this.keyBoardInfo.isActive = false
        } else {
            this.keyBoardInfo.isActive = true
            this.callInputEvent()
        }

    }

    // touch start
    touchStart(touch){
        this.touchInfo.start = touch
    }

    // touch Drag
    touchDrag(touch){
        this.direction.x = touch.x - this.touchInfo.start.x
        this.direction.y = touch.y - this.touchInfo.start.y
        this.callInputEvent()

    }

    // touch end
    touchEnd(){
        this.callInputEventEnd()
    }

    // calculate direction and send out
    callInputEvent(){
        this.event(this.direction.clone().normalize())
    }

    // call when ever input is over
    callInputEventEnd(){
       this.eventEnd()
    }

}