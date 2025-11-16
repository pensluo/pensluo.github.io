/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 */

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import * as T from "../libs/CS559-Three/build/three.module.js";
import { Fence, WheatField, Fireflies, Text } from "./buildings.js";
import { Alien, Cow, Saucer } from "./vehicles.js";

let numInput = /** @type {HTMLInputElement} */ (document.getElementById("numInput"));

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// make the world
const size = 20;

let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 10,
    groundplanecolor: 0x478c37,
    ambient: .1,
    lightBrightness: 0,
});

// add skybox
const skyboxLoader = new T.CubeTextureLoader();
const textureCube = skyboxLoader.load( [
  './assets/px.png', './assets/nx.png',
  './assets/py.png', './assets/ny.png',
  './assets/pz.png', './assets/nz.png'
] );
world.scene.background = textureCube;

// add decorations to the world

let saucer = new Saucer(0, textureCube);
world.add(saucer);
saucer.setPos(0,6,0);

let fireflies1 = new Fireflies(0);
world.add(fireflies1);
fireflies1.setPos(-12,0,-13);

let fireflies2 = new Fireflies(2*Math.PI/3);
world.add(fireflies2);
fireflies2.setPos(4,0,12);

let fireflies3 = new Fireflies(4*Math.PI/3);
world.add(fireflies3);
fireflies3.setPos(13,0,-1);

let fence = new Fence(1.95);
world.add(fence);
fence.setPos(-6.8,0,-6.8);

for (let i = -10; i <= 11; i += 7){
  for (let j = -10; j <= 11; j+= 7){
    if ((Math.abs(i) >= 10) || (Math.abs(j) >= 10)){
      let field = new WheatField(0);
      world.add(field);
      field.setPos(i - .6,0,j - .6);
    }
  }
}

// add the cows
let cows = [];
let numCows = 20;
for (let i = 0; i < numCows; i++){
  // put them in a radom location inside the bounds of the area
  let x = 12*Math.random()-6;
  let z = 12*Math.random()-6;
  let theta = 2*Math.PI*Math.random();

  // don't spawn them inside the beam
  let dist = Math.sqrt(x*x + z*z);
  while (dist <= 2){
    x = 12*Math.random()-6;
    z = 12*Math.random()-6;
    dist = Math.sqrt(x*x + z*z);
  }

  let cow = new Cow(x,z,theta);
  world.add(cow);
  cows.push(cow);
}

// keyboard movement controls code adapted from 
// https://stackoverflow.com/questions/29266602/javascript-when-having-pressed-2-keys-simultaneously-down-leaving-one-of-them
let keyMap = [];
document.addEventListener("keydown", onDocumentKeyDown, true); 
document.addEventListener("keyup", onDocumentKeyUp, true);

// pass the cows to the alien so that they can interact with each other
let alien = new Alien(keyMap, cows);
world.add(alien);
alien.setPos(0,0,1);

function onDocumentKeyDown(event){ 
  let keyCode = event.keyCode;
  keyMap[keyCode] = true;
  alien.interact(); // handles picking up / throwing behavior at the moment of the key press
}
function onDocumentKeyUp(event){
  let keyCode = event.keyCode;
  keyMap[keyCode] = false;
}

// pass the alien to the cows so they can interact with each other
for (let cow of cows){
  cow.setAlien(alien);
}

// add text. pass the alien to the text so the text can update based on the alien
let text = new Text(world.active_camera, alien);
world.add(text);

// add ground texture
let lumps = new T.TextureLoader().load("./assets/noisehd.png");
lumps.wrapS = T.RepeatWrapping;
lumps.wrapT = T.RepeatWrapping;
lumps.repeat.set(8,8);
world.groundplane.material.map = lumps;
world.groundplane.material.normalMap = lumps;

// add lighting
let moonlight = new T.DirectionalLight("white", .2);
moonlight.shadow.camera.scale.set(5,5,5);
moonlight.position.set(20,20,20);
let moontarget = new T.Group();
moontarget.position.set(-1,0,-1);
moonlight.target = moontarget;
moonlight.castShadow = true;
world.scene.add(moonlight);
world.scene.add(moontarget);

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
