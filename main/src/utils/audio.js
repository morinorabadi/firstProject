import { Vector3 } from 'three'

export default class Audios
{
    constructor(assetsLoader){
        // store inforamtion about planets and character
        this.objects = {
            character : { position : new Vector3(900,50,100) },
            sun       : { audio : null, position : new Vector3(), distanse : 1200, isPlaying : false },
            earth     : { audio : null, position : new Vector3(), distanse : 900, isPlaying : false },
            mars      : { audio : null, position : new Vector3(), distanse : 900, isPlaying : false },
            mercury   : { audio : null, position : new Vector3(), distanse : 700, isPlaying : false },
        }
        this.planetsName = ["sun", "earth", "mars", "mercury"]

        // loading inforamtion
        assetsLoader.load({
            loadOver : () => {},
            // load sound for planet
            objects : [
                {type : "audio"  , src : "assets/audios/earth.mp3", loadOver : audio => { audio._loop = true; this.objects.earth.audio   = audio } },
                {type : "audio"  , src : "assets/audios/decore.mp3",loadOver : audio => { audio._loop = true; this.objects.sun.audio     = audio } },
                {type : "audio"  , src : "assets/audios/human.mp3", loadOver : audio => { audio._loop = true; this.objects.mars.audio    = audio } },
                {type : "audio"  , src : "assets/audios/tasme.mp3", loadOver : audio => { audio._loop = true; this.objects.mercury.audio = audio } },
            ]
        })

        setInterval( () => { this.chechDistance() }, 200 )
    }

    // update world position from other class
    updatePosition(name,position){
        this.objects[name].position = position
    }

    // every 200 milisecends chech distanse between character and planets 
    chechDistance(){
        this.planetsName.forEach(planet => {
            const planetObject = this.objects[planet]
            const distanse = this.objects.character.position.distanceToSquared( planetObject.position )


            if ( distanse < planetObject.distanse ) {

                if ( !planetObject.isPlaying ) { 
                    planetObject.isPlaying = true
                    planetObject.audio.play()
                }

                let volume = (planetObject.distanse - distanse) / planetObject.distanse * 2 + 0.2
                if (volume > 1 ) { volume = 1 }

                planetObject.audio.volume( volume )

            } else {
                if ( planetObject.isPlaying ) { 
                    planetObject.isPlaying = false
                    planetObject.audio.pause()
                }
            }
        })
    }
}