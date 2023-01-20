class WorldGenerator
{
    constructor(){        
        // store worlds information
        this.worlds = []

        this.baseWorld = [
            this.generate({x : -1, z : 1}), this.generate({x : 0, z : 1}), this.generate({x : 1, z : 1}),
            this.generate({x : -1, z : 0}), this.generate({x : 0, z : 0}), this.generate({x : 1, z : 0}),
            this.generate({x : -1, z :-1}), this.generate({x : 0, z :-1}), this.generate({x : 1, z :-1}),
        ]


    }
    generate(position){
        const info = { 
            planets : this.generatePlanet(),
            stars : this.generateStar(),
            position : position,
        }
        this.worlds.position = info
        return info
    }
    generatePlanet(){
        const planets = []
        for (let index = 0; index < Math.round(Math.random()* 8); index++) {
            planets.push({
                position : {
                    x : (Math.random() - 0.5) * 200, // -100 to + 100
                    y : (Math.random() - 0.5) * 10, // -5 to +5
                    z : (Math.random() - 0.5) * 200 // -100 to + 100
                },
                color : this.generateColor()
            })
        }
        return planets
    }
    generateStar(){
        const stars = [] 
        for (let index = 0; index < Math.round(Math.random()* 8); index++) {
            stars.push({
                count : Math.round((Math.random() + 1) * 1000)  , // 2k to 4k
                size : Math.random() / 2 + 0.25 , // 0.25 to 0.75
                color : Math.random() ,
            })
        }
        return stars 
    }
    generateColor(){
        return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    }
}

module.exports = WorldGenerator