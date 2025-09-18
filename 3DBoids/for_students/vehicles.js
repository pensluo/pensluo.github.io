/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";

// get our inputs from the html page
let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));
let alignmentSlider = /** @type {HTMLInputElement} */ (document.getElementById("alignment"));
let separationSlider = /** @type {HTMLInputElement} */ (document.getElementById("separation"));
let cohesionSlider = /** @type {HTMLInputElement} */ (document.getElementById("cohesion"));
let distanceSlider = /** @type {HTMLInputElement} */ (document.getElementById("dist"));
let collisionCheck = /** @type {HTMLInputElement} */ (document.getElementById("collisionCheck"));

const size = 1; // visible size of the boid (does NOT affect collision)
const rayHeight = 1; // y elevation where raycasters will originate (in this case, in the center of each cube)
const flashTime = 500; // boids flash for .5 seconds after a collision
const bound = 20 - size/2; // distance from (0,0,0) that the boids are allowed inside
const padding = 1; // boids can end up outside the bounds as the page loads, if they are farther than bound + padding they get teleported back to the origin
const collisionDist = 1.1;
const rayCollisionDist = 1;
const nearFactor = 4; // used in determining flocking behaviors. explained more thoroughly below

let boidCount = 0;

export class Boid extends GrObject{
    constructor(xpos, zpos, theta, index, bound){ 
        let geo = new T.BoxGeometry(size, size, size);
        let mat = new T.MeshStandardMaterial({color: 0x0000FF});
        let mesh = new T.Mesh(geo, mat);

        let boid = new T.Group();
        boid.add(mesh);
        mesh.position.set(0,size/2,0);

        // changing the boid's material would affect all boids, so to change its color, make a slightly bigger 
        // mesh around the boid that's only visible when we want it to be.
        let flashMat = new T.MeshStandardMaterial({color: 0xFF0000});
        let flashMesh = new T.Mesh(geo, flashMat);
        boid.add(flashMesh);
        flashMesh.position.set(0,size/2,0);
        flashMesh.scale.set(1.1, 1.1, 1.1);
        flashMesh.visible = false;

        super(`Boid-${++boidCount}`, boid);

        boid.position.set(xpos, 0, zpos);
        boid.rotateY(theta);

        let ctimer = 0; // timer used to make the boid change color when it hits something

        this.ctimer = ctimer;
        this.boid = boid;
        this.flash = flashMesh;
        this.others = []; // initialized in setOthers to contain the rest of the boids in the scene
        this.raycasters = []; // initialized in setOthers. explained below
        this.index = index; // this boid's index in the list of boids in the scene
        this.wallRaycaster = null;
        this.wall = bound;
    }
    setOthers(others){
        // store the rest of the boids in the scene
        this.others = others;
        let pos = new T.Vector3(this.boid.position.x, rayHeight, this.boid.position.z);
        for (let i = 0; i < this.others.length; i++){
            // make a raycaster that points to each of the other boids
            const other = this.others[i].boid;
            let dir = new T.Vector3(other.position.x - this.boid.position.x, 0, other.position.z - this.boid.position.z);
            dir = dir.normalize();
            if (i != this.index){ // make sure we don't make one pointing to ourself
                let rc = new T.Raycaster(pos, dir, 0, 32);
                this.raycasters.push(rc);
            } else {
                this.raycasters.push(null);
            }
        }
        // make a raycaster that points forward to detect wall collision
        let facing = new T.Vector3();
        this.boid.getWorldDirection(facing);
        this.wallRaycaster = new T.Raycaster(pos, facing);
    }
    stepWorld(delta){
        let speed = Number(speedSlider.value);

        // random boid steering
        let currentVec = new T.Vector3();
        this.boid.getWorldDirection(currentVec);
        let currentAngle = Math.atan2(currentVec.x, currentVec.z);

        let randomDraw = Math.floor(50 * Math.random()); // 1 in 50 chance to turn slightly
        if (randomDraw == 0){
            let change = .3 - .6 * Math.random(); // change size: +-.3
            this.boid.rotateOnWorldAxis(new T.Vector3(0,1,0),change);
        }

        // stay in bounds
        let facing = new T.Vector3();
        this.boid.getWorldDirection(facing);
        // stay in bounds using a raycaster
        if (collisionCheck.checked){
            this.wallRaycaster?.set(new T.Vector3(this.boid.position.x, rayHeight, this.boid.position.z), facing);
            let wallIntersect = this.wallRaycaster?.intersectObject(this.wall.objects[0])[0];
            if (wallIntersect){
                if (wallIntersect.distance <= .5){
                    // there is a collision
                    this.boid.rotateY(Math.PI);
                    this.ctimer = flashTime;
                }
            }
            // bounce the boids back in if they floated out during loading
            if ((this.boid.position.x<-bound-padding)||(this.boid.position.x>bound+padding)||(this.boid.position.z<-bound-padding)||(this.boid.position.z>bound+padding)){
                this.boid.position.set(0, 0, 0);
            }
        // stay in bounds using distance math
        } else {
            if (this.boid.position.x < -bound){
                this.boid.position.set(-bound, 0, this.boid.position.z);
                this.boid.rotateY(Math.PI);
                this.ctimer = flashTime;
            }
            if (this.boid.position.x > bound){
                this.boid.position.set(bound, 0, this.boid.position.z);
                this.boid.rotateY(Math.PI);
                this.ctimer = flashTime;
            }
            if (this.boid.position.z < -bound){
                this.boid.position.set(this.boid.position.x, 0, -bound);
                this.boid.rotateY(Math.PI);
                this.ctimer = flashTime;
            }
            if (this.boid.position.z > bound){
                this.boid.position.set(this.boid.position.x, 0, bound);
                this.boid.rotateY(Math.PI);
                this.ctimer = flashTime;
            }
        }

        // boid collision
        let nearby = []; // keeps track of nearby boids that will influence steering
        let verynearby = []; // separation works best with very nearby boids, so keep a 2nd list
        for (let i = 0; i < this.others.length; i++){
            if (i !== this.index){
                let thisx = this.boid.position.x;
                let thisz = this.boid.position.z;
                let thatx = this.others[i].boid.position.x;
                let thatz = this.others[i].boid.position.z;

                if (collisionCheck.checked){
                    //update raycasters (if toggle is on)
                    const other = this.others[i].boid;
                    let dir = new T.Vector3(other.position.x - this.boid.position.x, 0, other.position.z - this.boid.position.z);
                    dir = dir.normalize();
                    this.raycasters[i].set(new T.Vector3(this.boid.position.x, rayHeight, this.boid.position.z), dir);
                    //collision using raycasters
                    let myIntersect = this.raycasters[i].intersectObject(this.boid)[0];
                    let otherIntersect = this.raycasters[i].intersectObject(this.others[i].boid)[0];
                    if (myIntersect && otherIntersect){
                        let dist = otherIntersect.distance - myIntersect.distance;
                        if (dist <= rayCollisionDist){
                            // we collided
                            let xdir = thisx-thatx;
                            let zdir = thisz-thatz;
                            let angle = Math.atan2(xdir, zdir);
                            this.boid.setRotationFromAxisAngle(new T.Vector3(0,1,0), angle);
                            this.ctimer = flashTime;
                        }
                    }
                } else { // use distances
                    if ((Math.abs(thisx-thatx) <= collisionDist)&&(Math.abs(thisz-thatz) <= collisionDist)){ 
                        let xdir = thisx-thatx;
                        let zdir = thisz-thatz;
                        let angle = Math.atan2(xdir, zdir);
                        this.boid.setRotationFromAxisAngle(new T.Vector3(0,1,0), angle);
                        this.ctimer = flashTime;
                    }
                }

                // keep track of nearby boids that will influence steering
                const distance = Number(distanceSlider.value);
                if (Math.sqrt((thisx-thatx)*(thisx-thatx)+(thisz-thatz)*(thisz-thatz)) <= distance){
                    nearby.push(this.others[i]);
                }
                // keep track of VERY nearby boids to influence separation steering
                if (Math.sqrt((thisx-thatx)*(thisx-thatx)+(thisz-thatz)*(thisz-thatz)) <= distance/nearFactor){
                    verynearby.push(this.others[i]);
                }
            }
        }

        // boid alignment
        let alignment = Number(alignmentSlider.value);
        let avgxv = 0.0;
        let avgzv = 0.0;
        let dir = new T.Vector3(); // make an empty vector to store the directions of the other boids as we sum them
        let mydir = new T.Vector3();
        this.boid.getWorldDirection(mydir);
        // sum the x and z components of all the nearby boids
        nearby.forEach (function (boid){
            boid.boid.getWorldDirection(dir);
            avgxv += dir.x;
            avgzv += dir.z;
        });

        if (nearby.length != 0){ // avoid dividing by 0
            // take the average of all the x and z compononets of the other boids
            avgxv = avgxv/nearby.length;
            avgzv = avgzv/nearby.length;
        } else {
            dir = mydir;
            avgxv = dir.x;
            avgzv = dir.z;
        }

        let desiredAngle = Math.atan2(avgxv, avgzv); // this is the average angle of the other boids
        currentAngle = Math.atan2(mydir.x,mydir.z);
        let change; // this is how much we will turn in this frame
        if (Math.abs(desiredAngle-currentAngle) > Math.PI){ // make sure we're not trying to turn more than 180 degrees
            change = -alignment*(desiredAngle-currentAngle)/75; // 75 is an arbitrary number, it's just to make sure we don't turn too fast
        } else {
            change = alignment*(desiredAngle-currentAngle)/75;
        }
        currentAngle += change;
        this.boid.setRotationFromAxisAngle(new T.Vector3(0,1,0), currentAngle);

        // boid separation
        let separation = Number(separationSlider.value);
        let me = this.boid;
        let thisx = me.position.x;
        let thisz = me.position.z;
        verynearby.forEach (function (boid){
            let xdir = thisx - boid.boid.position.x;
            let zdir = thisz - boid.boid.position.z;
            let separationTheta = Math.atan2(xdir,zdir); // the angle we need to face to go away from the nearby boid
            let separationAmt;
            if (Math.abs(separationTheta-currentAngle) > Math.PI){ // don't turn more than 180 degrees
                separationAmt = -separation*(separationTheta-currentAngle)/200; // 200 is another arbitrary number
            } else {
                separationAmt = separation*(separationTheta-currentAngle)/200;
            }
            currentAngle += separationAmt;
            me.setRotationFromAxisAngle(new T.Vector3(0,1,0), currentAngle);
        });

        // boid cohesion
        let cohesion = Number(cohesionSlider.value);
        let avgx = 0;
        let avgz = 0;
        // sum the positions of all the nearby boids
        nearby.forEach (function (boid){
            avgx += boid.boid.position.x;
            avgz += boid.boid.position.y;
        });

        if (nearby.length != 0){ // don't do anything if we aren't near any other boids
            // find the average position, i.e. the "center" of the nearby boids
            avgx = avgx/nearby.length;
            avgz = avgz/nearby.length;
            let cohesionAngle = Math.atan2(avgx-thisx, avgz-thisz); // the angle we need to face to go to the center of all nearby boids
            let cohesionAmount;
            if (Math.abs(cohesionAngle-currentAngle) > Math.PI){ // don't turn more than 180 degrees
                cohesionAmount = -cohesion*(cohesionAngle-currentAngle)/100;
            } else {
                cohesionAmount = cohesion*(cohesionAngle-currentAngle)/100;
            }
            currentAngle += cohesionAmount;
            this.boid.setRotationFromAxisAngle(new T.Vector3(0,1,0), currentAngle);
        }  

        // move the boid
        this.boid.translateZ(delta/5000 * speed);
        // update the flashing timer and effect
        this.ctimer -= delta;
        if(this.ctimer > 0){
            this.flash.visible = true;
        } else {
            this.flash.visible = false;
        }

    }
}