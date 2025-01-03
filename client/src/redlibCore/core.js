// utils
import Events from "./utils/Events"
import Clock from './utils/Clock'
import Sizes from './utils/Sizes'
import TouchInput from './utils/TouchInput'
/**
 * available options
 * ----------------------------------------
 * name           ==     default          |
 * ----------------------------------------
 * rootId         ==     app              |
 * fps            ==     60               |
 * 
 * 
 */


/**
 * available events
 * 
 * global events -->
 * 
 * process      -> number   return delta ( times passed from last process event )
 * resize       -> Vector2  ( x and y are sizes of customer view )
 * scroll       -> number
 * touchDrag    -> none
 * touchMove    -> Vector2  base on screen result is allwasy between -1 and 1
 * touchStart   -> Vector2  base on screen result is allwasy between -1 and 1
 * touchEnd     -> none
 * 
 * ------------------
 */

class RedLib{
    constructor(options={}){
        /**
        * Options
        */
        const rootId          = options.rootId          || "app";
        const fps             = options.fps             || 30;


        // global event handler
        this.globalEvent = new Events()

        // Clock handler and create process event 
        this.clock = new Clock(fps,this.globalEvent)

        // store window sizes - create and handle resize event
        this.sizes = new Sizes(this.globalEvent)
        
        // handle mobile and desktop, scroll and touch events 
        // create scroll event
        // create touchDrag event
        // create touchStart and touchEnd event
        this.touchInput = new TouchInput(this.globalEvent)
        
    }
}

let redlibcore = null

export function redLibInit(option){
    if ( !redlibcore ){
        redlibcore = new RedLib(option)
    }
}

export function getRedLibCore(){
    if (redlibcore){
        return redlibcore
    }
}

export function getRedLibCoreEvent(){
    if (redlibcore){
        return redlibcore.globalEvent
    }
}