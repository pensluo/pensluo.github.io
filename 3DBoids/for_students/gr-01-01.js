/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
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
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplanesize: 20, // make the ground plane big enough for a world of stuff
    groundplanecolor: 0x478c37,
    ambient: .5,
    lightBrightness: 0,
});

let boundary = new Boundary();
world.add(boundary);

let boids = [];
let numBoids = parseInt(numInput.value);
if (numBoids < 0){
  numBoids = 0;
}
if (numBoids > 50){
  numBoids = 50;
}
for (let i = 0; i < numBoids; i++){
  let x = 16*Math.random()-8;
  let z = 16*Math.random()-8;
  let theta = 2*Math.PI*Math.random();
  let boid = new Boid(x, z, theta, i, boundary);
  world.add(boid);
  boids.push(boid);
}
for (let i = 0; i < boids.length; i++){
  boids[i].setOthers(boids);
}

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
