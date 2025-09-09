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
import { HippedHouse, GableHouse, Barn, Oak, Silo, Fence, WheatField, Road, Fireflies, Farmhouse, SmallRoad, SingleFence } from "./buildings.js";
import { Scooter, Saucer, Cow, Alien, AbductedCow, Car} from "./vehicles.js";
import * as T from "../libs/CS559-Three/build/three.module.js";


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

// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
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

for (let i = 0; i < 10; i++){
  let tree = new Oak();
  world.add(tree);
  tree.setPos(-19 + 4*i, 0, 1.5 + 1.66*i);
}

let t1 = new Oak();
world.add(t1);
t1.setPos(3,0,-19);

let t2 = new Oak();
world.add(t2);
t2.setPos(-15,0,-2);

let t3 = new Oak();
world.add(t3);
t3.setPos(17,0,8);

let t5 = new Oak();
world.add(t5);
t5.setPos(-13,0,16);

let t6 = new Oak();
world.add(t6);
t6.setPos(-5,0,13);

let barn1 = new Barn();
world.add(barn1);
barn1.setPos(10.5,0,-11.9);

let scooter1 = new Scooter(0);
world.add(scooter1);

let scooter2 = new Scooter(19);
world.add(scooter2);

let scooter3 = new Scooter(18);
world.add(scooter3);

let saucer1 = new Saucer(false, textureCube);
world.add(saucer1);
saucer1.setPos(-3.5,6,-6.5); //10.5,6,-6.5

let saucer2 = new Saucer(true, textureCube);
world.add(saucer2);
saucer2.setPos(-9.5,0,-9.5);

//cows here
let cows = [];
for (let i = 0; i < 50; i++){
  let x = 16*Math.random()-8;
  let z = 16*Math.random()-8;
  let theta = 2*Math.PI*Math.random();
  let cow = new Cow(x,z,theta,i);
  world.add(cow);
  cows.push(cow);
}
for (let i = 0; i < cows.length; i++){
  cows[i].setFriends(cows);
}

let silo1 = new Silo(1);
world.add(silo1);
silo1.setPos(14,0,-13);

let silo2 = new Silo(.7);
world.add(silo2);
silo2.setPos(15.5,0,-13);

let circles = [[1, 0],[0, 1],[0, 2]];
for (let i = 0; i < 3; i++){
  for (let j = 0; j < 2; j++){
    let field = new WheatField(circles[i][j]);
    world.add(field);
    field.setPos(-16.5+7*i, 0, -16.5+7*j);
  }
}

for (let i = 0; i < 20; i++){
  let alien = new Alien(i);
  world.add(alien);
  let xrand = Math.random();
  let zrand = Math.random();
  alien.setPos(-9 +xrand,0,-9 +zrand); //-9.5,0,-9.5
}

let road1 = new Road();
world.add(road1);
road1.setPos(0,0,0);

let abductedCow = new AbductedCow();
world.add(abductedCow);
abductedCow.setPos(10.5,0,-11.4);

let car1 = new Car(textureCube);
world.add(car1);
car1.setPos(-20,0,2.7);

let smallroad1 = new SmallRoad(16);
world.add(smallroad1);
smallroad1.setPos(-17,0,20);

let smallroad3 = new SmallRoad(13);
world.add(smallroad3);
smallroad3.setPos(-9,0,20);

let smallroad5 = new SmallRoad(9);
world.add(smallroad5);
smallroad5.setPos(-1,0,20);

let smallroad7 = new SmallRoad(6);
world.add(smallroad7);
smallroad7.setPos(7,0,20);

let singleFence = new SingleFence();
world.add(singleFence);
singleFence.setPos(-20,0,-5.5);

let houses = [[2,1,2,3],[0,2,3,1],[0,1,1,2],[0,2,3,2],[0,0,2,1],[0,0,1,3],[0,0,0,2],[0,0,0,3]];
for (let i = 0; i < houses.length; i++){
  for (let j = 0; j < houses[i].length; j++){
    let house;
    if (houses[i][j]==1){
      house = new HippedHouse();
    } else if (houses[i][j]==2){
      house = new GableHouse();
    } else if (houses[i][j]==3){
      house = new Farmhouse();
    }
    if (house != null){
      world.add(house);
      house.setPos(-19+4*i,0,6+4*j);
      if (i%2==0){
        house.objects[0].rotateY(Math.PI/2);
      } else {
        house.objects[0].rotateY(-Math.PI/2);
      }
    }
  }
}

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
//moonlight.castShadow = true;
world.scene.add(moonlight);
world.scene.add(moontarget);

// commented for faster loading during development. uncomment when done
// for (const grobject of world.objects){
//     for (const object of grobject.objects){
//       if (object instanceof T.Group){
//         object.traverse( function(mesh) {
//           mesh.castShadow = true;
//           mesh.receiveShadow = true;
//         } );
//       }
//       if (object instanceof T.Mesh){
//         object.castShadow = true;
//         object.receiveShadow = true;
//       }
//     }
// }
//world.renderer.shadowMap.enabled = true;
//world.scene.add( new T.CameraHelper( moonlight.shadow.camera ) );

// while making your objects, be sure to identify some of them as "highlighted"

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
// of course, the student should highlight their own objects, not these
highlight("Scooter Alien-3");
highlight("Car-1");
highlight("Saucer-1");
highlight("Saucer-2");
highlight("Wheat Field-6");
highlight("Alien-1");
highlight("Abducted Cow-1");
highlight("Barn-1");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
