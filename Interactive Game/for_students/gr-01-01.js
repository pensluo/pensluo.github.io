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
import { Fence, WheatField, Fireflies } from "./buildings.js";
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

const skyboxLoader = new T.CubeTextureLoader();
const textureCube = skyboxLoader.load( [
  './assets/px.png', './assets/nx.png',
  './assets/py.png', './assets/ny.png',
  './assets/pz.png', './assets/nz.png'
] );
world.scene.background = textureCube;

let fireflies1 = new Fireflies(0);
world.add(fireflies1);
fireflies1.setPos(-12,0,-13);

let fireflies2 = new Fireflies(2*Math.PI/3);
world.add(fireflies2);
fireflies2.setPos(4,0,12);

let fireflies3 = new Fireflies(4*Math.PI/3);
world.add(fireflies3);
fireflies3.setPos(13,0,-1);

let fence = new Fence();
world.add(fence);

let field = new WheatField(0);
world.add(field);

let alien = new Alien(0);
world.add(alien);

let cow = new Cow();
world.add(cow);

let saucer = new Saucer(0, textureCube);
world.add(saucer);
saucer.setPos(0,6,0);

let lumps = new T.TextureLoader().load("./assets/noisehd.png");
lumps.wrapS = T.RepeatWrapping;
lumps.wrapT = T.RepeatWrapping;
lumps.repeat.set(8,8);
world.groundplane.material.map = lumps;
world.groundplane.material.normalMap = lumps;

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
