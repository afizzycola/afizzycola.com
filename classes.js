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

export class DescriptionCube extends THREE.Mesh {
    constructor (){
        const  geometry = new THREE.BoxGeometry( 20, 5, 5, 32 )
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
        const {x, y, title, url, titleX, description} = blockDetail
        const {font} = config
        this.titleCube = new Cube()
        this.titleCube.position.set(x, y, 0)
        this.titleCube.userData = {
            URL: url,
        }
        this.descCube = new DescriptionCube()
        this.descCube.position.set(x + 17, y, 0)
        this.descCube.userData = {
            URL: url,
        }
  
        this.title = new Label(title, font, 0.8, 1)
        console.log(this.title)
        this.title.position.set(x + titleX, y, 1.55)
        this.descriptions = []
        let yAdjust = 1
        description.forEach((descrip) => {
            const descripTitle = new Label(descrip, font, 0.65, 1)
            descripTitle.position.set(x + 17 -9.5, y + yAdjust, 1.55)
            this.descriptions.push(descripTitle)
            yAdjust += -1
        })
  
        scene.add(this.titleCube, this.descCube, this.title)
        this.descriptions.forEach(descripTitle => {
            scene.add(descripTitle)
        })
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