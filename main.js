import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import axios from 'axios'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 2000 );
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg')
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.z = 17;
camera.position.y = 10;
camera.position.x = -24;

renderer.render( scene, camera );

async function getBlocks (fromHeight, toHeight) {
  const lineItemAPI = axios.create({
      baseURL: "https://d89qxc58eb.execute-api.eu-west-2.amazonaws.com/test",
      headers: {
          'Content-Type': 'application/json',
          'x-api-key': "E9qqUWRIK384dIXNqE7N14sBPLSqtFQk5imrY18W"
      }
  });

  let response
  try {
    response = await lineItemAPI.get(`/line-items/block-height?from=${fromHeight}&to=${toHeight}`)
    const txList = response.data.Items
    let blocks = []
    for (let i = fromHeight; i <= toHeight; i++) {
      let txsInBlock = txList.filter(tx => tx.blockHeight === i)
      let block = {
        blockHeight: i,
      }
      if (txsInBlock.length > 0) {
        block.blockTime = txsInBlock[0].blockTime
        txsInBlock.forEach(tx => {
          delete tx.blockTime
          delete tx.blockHeight
        })
        block.txs = txsInBlock
      }
      blocks.push(block)
    }
    return blocks
  } catch (error) {
    throw Error(error)
  }

}

let blocksList
getBlocks(2189078, 2189878)
  .then(blocks => {
    //console.log(blocks)
    blocksList = blocks
  })
  .catch(error => {
    console.log(error)
  })


// blocksList = [
//   {
//     txId: "afeffb914876ee83b923d3c1552a60278a2e9b30a3d2da6c2bc581541b2bbf8d",
//     blockHeight: 702585,
//     blockTime: "2021-09-28 15:34",
//     messages: [
//       "Jess and Sam cut the cake",
//       "many happy returns"
//     ]
//   },
//   {
//     txId: "cfeffb914876ee83b923d3c1552a60278a2e9b30a3d2da6c2bc581541b2bbf8d",
//     blockHeight: 702587,
//     blockTime: "2021-09-28 15:16",
//     messages: ["Jess and Sam married!!"],
//   },
//   {
//     txId: "c3552a60276ee83b923d3c1552a60278a2e9b30a3d2da6c2bc581541b2bbf8d",
//     blockHeight: 702587,
//     blockTime: "2021-09-28 15:16",
//     messages: ["Where they?"],
//   }
// ]

const loader = new FontLoader();
loader.load( 'assets/helvetiker_regular.typeface.json', function (font) {
  setTimeout(() => {
    let x = -40;
    blocksList.reverse().forEach(block => {
      new Block(scene, { 
        x: x, 
        blockHeight: block.blockHeight.toString(), 
        blockTime: block.blockTime 
      }, {font: font}, block.txs)
      x += 10
    })
    
  }, 1000)
  
})

// qr code code START

// const qrGeo = new THREE.PlaneGeometry( 3.5, 3.5, 3.5 );
// const qrMat = new THREE.MeshBasicMaterial( {
//   map: new THREE.TextureLoader().load( 'assets/qr-code.png' ),
//   side: THREE.DoubleSide
// });
// const qr = new THREE.Mesh( qrGeo, qrMat );
// qr.position.z = -3
// qr.position.y = 6.25
// qr.position.x = -3.1
// qr.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 1.75)
// scene.add(qr)

// END

const btcGeo = new THREE.CircleGeometry( 5, 35);
const btcMat = new THREE.MeshBasicMaterial( {
  map: new THREE.TextureLoader().load( 'assets/bitcoin.png' ),
});
const btc = new THREE.Mesh( btcGeo, btcMat );
btc.position.z = -20
btc.position.y = 90
btc.position.x = 30
btc.rotateY(Math.PI * 1.75)
btc.rotateX(Math.PI * 2.5)
//btc.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI * 1.75)
scene.add(btc)


function addWeddingCake(numberOfLayers) {
  let radius = 2
  let height = 1
  let y = 3
  const icingTexture = new THREE.TextureLoader().load( './assets/icing.jpg' );
  for (let i = 0; i < numberOfLayers; i++) {
    const cakeGeo = new THREE.CylinderGeometry( radius, radius, height, 32 );
    const cakeMat = new THREE.MeshStandardMaterial( { 
      map: icingTexture 
    });
    const cake = new THREE.Mesh( cakeGeo, cakeMat );
    cake.position.y = y
    scene.add(cake)
    radius *= 0.75
    height *= 0.9
    y += height
  }
}



const pointLight = new THREE.PointLight( 0xffffff);
pointLight.position.set( 5, 20, 5 );

const ambientLight = new THREE.AmbientLight( 0xffffff);


scene.add( pointLight, ambientLight );

const lightHelper = new THREE.PointLightHelper( pointLight);
//const gridHelper = new THREE.GridHelper( 200, 50 );


scene.add( 
  lightHelper, 
  //gridHelper 
);

const controls = new OrbitControls( camera, renderer.domElement );

const spaceTexture = new THREE.TextureLoader().load( './assets/space.jpg' );
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame( animate );
  //cake.rotation.x += 0.001;
  //cake.rotation.y += 0.005;

  controls.update();

  renderer.render( scene, camera );
}

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material );
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  scene.add( star );
}


Array(200).fill().forEach(addStar)
animate()



class Block {
  constructor (scene, blockDetail, config, txs = []){
      console.log("blockDetail", blockDetail)
      const {x, blockHeight} = blockDetail
      const {font} = config
      this.cube = new Cube()
      this.cube.position.set(x, 0, 0)

      this.blockHeight = new Label(blockHeight, font, 0.8, 1)
      this.blockHeight.position.set(x - 2.4, 0, 1.55)

      scene.add(this.cube, this.blockHeight)
      console.log(blockDetail)
      if (txs.length > 0) {
        const {blockTime} = blockDetail
        console.log(blockTime)
        this.blockTime = new Label(`------------------------ ${blockTime} ---------------------------------------------------`, font, 0.5)

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