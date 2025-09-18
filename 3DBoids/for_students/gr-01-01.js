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
import { Boundary } from "./buildings.js";
import { Boid } from "./vehicles.js";
import * as T from "../libs/CS559-Three/build/three.module.js";

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
    groundplanesize: size,
    groundplanecolor: 0xFFFFFF,
    ambient: 1,
    lightBrightness: 0,
});

let boundary = new Boundary(size);
world.add(boundary);

let boids = []; // keep an array of all the boids
let numBoids;
if (numInput.value){
  numBoids = parseInt(numInput.value);
} else {
  numBoids = 100;
}
if (numBoids < 0){
  numBoids = 0;
}
if (numBoids > 100){
  numBoids = 100;
}
// add boids to the world
for (let i = 0; i < numBoids; i++){
  // put each one in a random spot in bounds
  let x = size*2*Math.random()-size;
  let z = size*2*Math.random()-size;
  // facing a random angle
  let theta = 2*Math.PI*Math.random();
  let boid = new Boid(x, z, theta, i, boundary);
  world.add(boid);
  boids.push(boid);
}
// pass the array of all boids to each boid so they can have collision and steering behaviors
for (let i = 0; i < boids.length; i++){
  boids[i].setOthers(boids);
}

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
