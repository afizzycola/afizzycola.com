import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


export class Cube extends THREE.Mesh {
    constructor (){
        const  geometry = new THREE.BoxGeometry( 10, 5, 5, 32 )
        const material = new THREE.MeshStandardMaterial( { 
            color: 0x2d3348,
        });
        super(geometry, material)
    }
}
  
export class Label extends THREE.Mesh  {
    constructor (text, font, fontSize, fontHeight = 0){

        const  geometry = new TextGeometry(text, {
            font: font,
            size: fontSize,
            height: fontHeight,
            curveSegments: 12,
            bevelEnabled: false
        })
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
        })
        super(geometry, material)
    }
}

export class Block {
    constructor (scene, blockDetail, config, txs = []){
        const {x, title, url, titleX} = blockDetail
        const {font} = config
        this.cube = new Cube()
        this.cube.position.set(x, 0, 0)
        this.cube.userData = {
            URL: url,
        }
  
        this.title = new Label(title, font, 0.8, 1)
        console.log(this.title)
        this.title.position.set(x + titleX, 0, 1.55)
  
        scene.add(this.cube, this.title)
        if (txs.length > 0) {
          const {blockTime} = blockDetail
          this.blockTime = new Label(``, font, 0.5)
  
          this.txIds = []
          this.messages = []
          let y = 4.25;
          txs.reverse().forEach(tx => {
            const txLabel = new Label(tx.txId, font, 0.3)
            txLabel.position.set(x + 0.1, y, 2)
            txLabel.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 1.75)
            this.txIds.push(txLabel)
            y += 0.75
            tx.messages.reverse().forEach(message => {
              const messageLabel = new Label(message, font, 0.3)
              messageLabel.position.set(x, y, 2)
              messageLabel.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 1.75)
              this.messages.push(messageLabel)
              y += 1
            })
            y += 1
          })
  
          this.blockTime.position.set(x + 0.1, -3, 0.1)
          this.blockTime.rotateY(Math.PI * 1.5)
          this.blockTime.rotateX(Math.PI * 1.5)
  
          scene.add(this.txId, this.blockTime, ...this.txIds, ...this.messages)
        }
    }
}