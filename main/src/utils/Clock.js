export default class Clock
{
    constructor(redlibcore){

        this.clock = Date.now()
        redlibcore.globalEvent.addCallBack('process', (delta) => { this.updateClock(delta) })

    }

    updateClock(delta){
        this.clock += delta
    }
    setClock(clock){
        this.clock = clock
    }
    getClock(){
        return this.clock
    }
}