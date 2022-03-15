import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

export default class Block {
    constructor ({txId, blockHeight, blockTime, message, font, x}, scene){
        this.cube = new Cube()
        this.txId = new Label(txId, font, 0.3)
        this.blockHeight = new Label(blockHeight, font, 1, 1)
        this.blockTime = new Label(`------------ ${blockTime} ---------------------------------------------------`, font, 0.5)
        this.message = new Label(message, font, 0.5)
        console.log("hello")

        this.cube.position.set(x, 0, 0)
        
        this.blockTime.position.set(x + 2, -3, 0.1)
        this.blockTime.rotateY(Math.PI * 1.5)
        this.blockTime.rotateX(Math.PI * 1.5)

        this.blockHeight.position.set(x, 0, 1.55)

        this.message.position.set(x + 0, -0.5, 0)
        this.message.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 1.75)
        
        this.txId.position.set(x + 2, 4.25, 0.1)
        this.txId.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 1.75)

        scene.add(this.cube, this.txId, this.blockTime, this.blockHeight, this.message)
    }
}

class Cube extends THREE.Mesh {
    constructor (){
        const  geometry = new THREE.BoxGeometry( 5, 5, 5, 32 )
        const material = new THREE.MeshStandardMaterial( { 
            color: 0x2d3348,
        });
        super(geometry, material)
    }
}

class Label extends THREE.Mesh  {
    constructor (text, font, fontSize, fontHeight = 0){
        const  geometry = new TextGeometry(text, {
            font: font,
            size: fontSize,
            height: fontHeight,
            curveSegments: 12,
            bevelEnabled: false,
        })
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
        })
        super(geometry, material)
    }
}


// class TxidLabel extends Label {
//     constructor (txid){
//         super(txid, 0.3)
//     }
// }

// class BlockTimeLabel extends Label {
//     constructor (blockTime){
//         super(`------------ ${blockTime} ---------------------------------------------------`, 0.5)
//     }
// }

// class MessageLabel extends Label {
//     constructor (message){
//         super(message, 0.5)
//     }
// }

