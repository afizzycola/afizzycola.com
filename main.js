import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg')
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.z = 30;

renderer.render( scene, camera );

const cheeseRindTexture = new THREE.TextureLoader().load( './assets/cheese-rind.jpg' );
const cheeseRindTexture2 = new THREE.TextureLoader().load( './assets/cheese-rind2.jpg' );

const geometry = new THREE.CylinderGeometry( 5, 5, 4, 32 )//TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( { 
  map: cheeseRindTexture,
  //color: 0x00ff00, 
  //wireframe: true 
});

const geometry2 = new THREE.CylinderGeometry( 3, 3, 4, 32 )//TorusGeometry( 10, 3, 16, 100 );
const material2 = new THREE.MeshStandardMaterial( { 
  map: cheeseRindTexture2,
  //color: 0x00ff00, 
  //wireframe: true 
});

const cake = new THREE.Mesh( geometry, material );
const cake2 = new THREE.Mesh( geometry2, material2 );
cake.position.y = 2;
cake2.position.y = 6;
scene.add( cake, cake2 );
const pointLight = new THREE.PointLight( 0xffffff);
pointLight.position.set( 5, 5, 5 );

const ambientLight = new THREE.AmbientLight( 0xffffff);


scene.add( pointLight, ambientLight );

const lightHelper = new THREE.PointLightHelper( pointLight);
//const gridHelper = new THREE.GridHelper( 200, 50 );


const planeGeometry = new THREE.PlaneGeometry( 150, 150);
const planeTexture = new THREE.TextureLoader().load( './assets/kitchen-countertop.jpg' );
const planeMaterial = new THREE.MeshBasicMaterial( {
  map: planeTexture, 
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = -Math.PI / 2;
scene.add( plane );



scene.add( 
  lightHelper, 
  //gridHelper 
);

const controls = new OrbitControls( camera, renderer.domElement );

const spaceTexture = new THREE.TextureLoader().load( './assets/kitchen-background.jpg' );
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame( animate );
  //cake.rotation.x += 0.001;
  //cake.rotation.y += 0.005;

  controls.update();

  renderer.render( scene, camera );
}

animate()