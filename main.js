import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import blocksList from './blockslist.js'
import { Block, Label } from './classes.js'
import fontJson from './assets/helvetiker_regular.typeface.json?url'
import bitcoinImg from './assets/bitcoin.png'
import twitterImg from './assets/twitter.png'
import githubImg from './assets/github.png'
import spaceImg from './assets/space.jpg'


const canvas = document.getElementById('bg')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 0.1, 2000 );
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );


camera.updateProjectionMatrix()

renderer.render( scene, camera );
const loader = new FontLoader();
let graphicalBlocks = []
loader.load( fontJson, (font) =>{
  let x = -16;
  let y = 0;
  blocksList.forEach(block => {
    const graphicalBlock = new Block(scene, { 
      x: x,
      y: y,
      description: block.description,
      title: block.title, 
      blockTime: block.blockTime,
      titleX: block.titleX,
      url: block.url
    }, {font: font}, block.txs)
    graphicalBlocks.push(graphicalBlock.cube)
    //x += 12
    y += -6
  })

  const header = new Label("afizzycola", font, 5)
  header.position.set(-22, 6.25, -3)
  scene.add(header)

  const projects = new Label("my projects:", font, 1)
  projects.position.set(-22, 3.3, -3)
  scene.add(projects)

  //donate code START
  // const donate = new Label("Donate:", font, 1)
  // donate.position.z = -3
  // donate.position.y = -6.25
  // donate.position.x = -6
  // scene.add(donate)
  //donate code END
  
})

//qr code code START

// const qrGeo = new THREE.PlaneGeometry( 6, 6, 6 );
// const qrMat = new THREE.MeshBasicMaterial( {
//   map: new THREE.TextureLoader().load( 'assets/qr-code.png' ),
//   side: THREE.DoubleSide
// });
// const qr = new THREE.Mesh( qrGeo, qrMat );
// qr.position.z = -3
// qr.position.y = -6.25
// qr.position.x = 10
// //qr.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI * 1.75)

// scene.add(qr)

//END

const btcGeo = new THREE.CircleGeometry( 2, 35);
const btcMat = new THREE.MeshBasicMaterial( {
  map: new THREE.TextureLoader().load(bitcoinImg),
  side: THREE.DoubleSide
});
const btc = new THREE.Mesh( btcGeo, btcMat );
btc.position.z = -50
btc.position.y = 20
btc.position.x = 30
btc.userData.URL = "https://bitcoin.org"
//btc.rotateY(Math.PI * 1.75)
//btc.rotateZ(-Math.PI * 1)
//btc.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI * 1.75)
scene.add(btc)

// logos
const twitterGeo = new THREE.CircleGeometry( 1, 35);
const twitterMat = new THREE.MeshBasicMaterial( {
  map: new THREE.TextureLoader().load(twitterImg),
});
const twitter = new THREE.Mesh( twitterGeo, twitterMat );
twitter.position.z = -3
twitter.position.y = 10
twitter.position.x = 13
twitter.userData.URL = "https://twitter.com/afizzycola"

const githubGeo = new THREE.CircleGeometry( 1, 35);
const githubMat = new THREE.MeshBasicMaterial( {
  map: new THREE.TextureLoader().load(githubImg),
});
const github = new THREE.Mesh( githubGeo, githubMat );
github.position.z = -3
github.position.y = 7
github.position.x = 13
github.userData.URL = "https://github.com/afizzycola"

scene.add(twitter, github)


// light related
const pointLight = new THREE.PointLight( 0xffffff);
pointLight.position.set( 5, 20, 5 );
const ambientLight = new THREE.AmbientLight( 0xffffff);
scene.add( pointLight, ambientLight );

// const lightHelper = new THREE.PointLightHelper( pointLight);
// //const gridHelper = new THREE.GridHelper( 200, 50 );

// scene.add( 
//   lightHelper, 
//   //gridHelper 
// );

//const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set(-4.534807074265601, 4.427075622197015, 38.730175153425655)

const spaceTexture = new THREE.TextureLoader().load(spaceImg);
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame( animate );
  rotateAboutPoint(btc, new THREE.Vector3(0, 0, -30 / 2), new THREE.Vector3(1, 1, 0).normalize(), Math.PI * 0.0005, true)
  stars.forEach(star => rotateAboutPoint(star, new THREE.Vector3(0, 0, -20 / 2), new THREE.Vector3(1, 1, 0).normalize(), Math.PI * 0.0005, true))

  renderer.render( scene, camera );
}

function createStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24 );
  const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
  const star = new THREE.Mesh( geometry, material );
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z)
  return star
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
  pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

  if(pointIsWorld){
      obj.parent.localToWorld(obj.position); // compensate for world coordinate
  }

  obj.position.sub(point); // remove the offset
  obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
  obj.position.add(point); // re-add the offset

  if(pointIsWorld){
      obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
  }

  //obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

let stars = []
Array(200).fill().forEach(() => {
  const star = createStar()
  scene.add( star );
  stars.push(star)
})



const mouseVector = new THREE.Vector3()
const raycaster = new THREE.Raycaster()
window.addEventListener( 'mousedown', goToUrl, false );
window.addEventListener( 'mousemove', toggleHandPicker, false );
animate()


function goToUrl(event) {
  event.preventDefault();
  mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1, 
  mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouseVector, camera);
  console.log(graphicalBlocks)
  var intersects = raycaster.intersectObjects(scene.children);
  console.log(intersects)
  if (intersects.length > 0) {
      window.open(intersects[0].object.userData.URL);
  }
}

function toggleHandPicker(event) {
  event.preventDefault();
  mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1, 
  mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouseVector, camera);
  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0 && intersects[0].object.userData.URL) {
    canvas.style.cursor = "pointer"
  } else {
    canvas.style.cursor = "auto"
  }
}