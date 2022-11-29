import * as THREE from 'three'

export default class Charater
{
    constructor(assetsLoader,redlibcore){
        this.group = new THREE.Group()
        this.charater = new THREE.Group() 
        
        assetsLoader.load({
            loadOver : () => {

            },
            objects : [
                {type : "gltf"   , src : "/assets/spaseShip.glb", loadOver : gltf    => {
                    this.charater.add(gltf.scene)
                    gltf.scene.rotation.y = Math.PI * 0.5 
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

        this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 0.1, 500)
        this.group.add(this.charater, this.camera)

        // adding process event for update position
        // redlibcore.globalEvent.addCallBack('process', (delta) => { this.updatePosition(delta) })
         
    }

    resize(sizes){
        this.camera.aspect = sizes.x /sizes.y 
    }

    // updatePosition(delta){
    //     if (this.touchInfo.isDraging){
    //         const deltaX = this.touchInfo.CurentDrag.x - this.touchInfo.start.x
    //         console.log(deltaX);
    //         this.group.position.x +=  this.touchInfo.CurentDrag.x - this.touchInfo.start.x
    //         // this.group.position.z +=  this.touchInfo.CurentDrag.y - this.touchInfo.start.y
    //     }
    // }
}