/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

// define your vehicles here - remember, they need to be imported
// into the "main" program

let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));
let alignmentSlider = /** @type {HTMLInputElement} */ (document.getElementById("alignment"));
let separationSlider = /** @type {HTMLInputElement} */ (document.getElementById("separation"));
let cohesionSlider = /** @type {HTMLInputElement} */ (document.getElementById("cohesion"));
let distanceSlider = /** @type {HTMLInputElement} */ (document.getElementById("dist"));
let collisionCheck = /** @type {HTMLInputElement} */ (document.getElementById("collisionCheck"));

const textureLoader = new T.TextureLoader();
const objLoader = new OBJLoader();

let carCount = 0;
export class Car extends GrObject{
    constructor(envMap){
        let group = new T.Group();

        let bodyMat = new T.MeshStandardMaterial({color: 0x991c2d, roughness: .1, metalness: 0, envMap: envMap});
        let tireMat = new T.MeshStandardMaterial({color: "black", roughness: 1});
        let glassMat = new T.MeshStandardMaterial({color: 0x444444, roughness: 0, metalness: .6, side: 2});

        let doorWindowGeo = new T.PlaneGeometry(3,1.7);
        let lWindow = new T.Mesh(doorWindowGeo, glassMat);
        group.add(lWindow);
        lWindow.position.set(-2,4.5,3.5);
        let rWindow = new T.Mesh(doorWindowGeo, glassMat);
        group.add(rWindow);
        rWindow.position.set(-2,4.5,-3.7);

        let frontWindowGeo = new T.PlaneGeometry(5,1.5);
        let frontWindow = new T.Mesh(frontWindowGeo, glassMat);
        group.add(frontWindow);
        frontWindow.position.set(-4.6,5.2,0)
        frontWindow.rotateZ(-Math.PI/6);
        frontWindow.rotateY(Math.PI/2);

        let chassisCurve = new T.Shape();
        chassisCurve.moveTo(0,0);
        chassisCurve.lineTo(0,3);
        chassisCurve.lineTo(-.3,5.5);
        chassisCurve.lineTo(-3.4,5.4);
        chassisCurve.lineTo(-4.3,3.6);
        chassisCurve.lineTo(-8.6,3.4);
        chassisCurve.lineTo(-9,2.7);
        chassisCurve.lineTo(-9,.7);
        chassisCurve.lineTo(-9.5,.7);
        chassisCurve.lineTo(-9.5,.2);
        chassisCurve.lineTo(0,0);

        let chassisSettings = {
            steps: 12,
            depth: 5,
            bevelEnabled: true,
            bevelThickness: 1
        };

        let chassisGeo = new T.ExtrudeGeometry(chassisCurve, chassisSettings);

        let wheelThingCurve = new T.Shape();
        wheelThingCurve.moveTo(-3.8,.1);
        wheelThingCurve.lineTo(-3.9,2.1);
        wheelThingCurve.lineTo(-6.6,2.5);
        wheelThingCurve.lineTo(-9,2.4);
        wheelThingCurve.lineTo(-9,.2);
        wheelThingCurve.lineTo(-8.5,.3);
        wheelThingCurve.lineTo(-8.1,1.2);
        wheelThingCurve.lineTo(-7.1,1.8);
        wheelThingCurve.lineTo(-5.5,1.5);
        wheelThingCurve.lineTo(-4.9,.1);
        wheelThingCurve.lineTo(-3.8,.1);

        let wheelThingSettings = {
            steps: 6,
            depth: 1,
            bevelEnabled: true,
            bevelThickness: .5
        };

        let wheelThingGeo = new T.ExtrudeGeometry(wheelThingCurve, wheelThingSettings);

        let sideShape = new T.Shape();
        sideShape.moveTo(0,0);
        sideShape.lineTo(0,2.9);
        sideShape.lineTo(7.6,3);
        sideShape.lineTo(7.5,.4);
        sideShape.lineTo(5.6,.4);
        sideShape.lineTo(5,1.5);
        sideShape.lineTo(4,1.7);
        sideShape.lineTo(3.2,1.4);
        sideShape.lineTo(2.6,.3);

        let sideGeo = new T.ExtrudeGeometry(sideShape, wheelThingSettings);

        let wheelGeo = new T.CylinderGeometry(1.5,1.5,1.5);

        let flwheel = new T.Mesh(wheelGeo, tireMat);
        group.add(flwheel);
        flwheel.position.set(-6.7,0,3.9);
        flwheel.rotateX(Math.PI/2);

        let frwheel = new T.Mesh(wheelGeo, tireMat);
        group.add(frwheel);
        frwheel.position.set(-6.7,0,-3.9);
        frwheel.rotateX(Math.PI/2);

        let blwheel = new T.Mesh(wheelGeo, tireMat);
        group.add(blwheel);
        blwheel.position.set(5.2,0,3);
        blwheel.rotateX(Math.PI/2);

        let brwheel = new T.Mesh(wheelGeo, tireMat);
        group.add(brwheel);
        brwheel.position.set(5.2,0,-3);
        brwheel.rotateX(Math.PI/2);

        let leftSide = new T.Mesh(sideGeo, bodyMat);
        group.add(leftSide);
        leftSide.position.set(1,0,1.5);

        let rightSide = new T.Mesh(sideGeo, bodyMat);
        group.add(rightSide);
        rightSide.position.set(1,0,-2.6);

        let leftWheelThing = new T.Mesh(wheelThingGeo, bodyMat);
        group.add(leftWheelThing);
        leftWheelThing.position.set(0,0,3.4);

        let rightWheelThing = new T.Mesh(wheelThingGeo, bodyMat);
        group.add(rightWheelThing);
        rightWheelThing.position.set(0,0,-4.8);

        let chassis = new T.Mesh(chassisGeo, bodyMat);
        group.add(chassis);
        chassis.position.set(0,0,-2.6);

        let bedGeo = new T.BoxGeometry(9,1,5.5);

        let bed = new T.Mesh(bedGeo, tireMat);
        group.add(bed);
        bed.position.set(4,0,0);

        let backGeo = new T.CylinderGeometry(.7,.7,5);
        let back = new T.Mesh(backGeo, bodyMat);
        group.add(back);
        back.position.set(8,.5,0);
        back.rotateX(Math.PI/2);

        let headlightGeo = new T.SphereGeometry(.7);
        let headlightMat = new T.MeshBasicMaterial({color: "white"});
        let taillightMat = new T.MeshBasicMaterial({color: "red"});

        let lheadlight = new T.Mesh(headlightGeo, headlightMat);
        group.add(lheadlight);
        lheadlight.position.set(-10,.5,2.4);

        let rheadlight = new T.Mesh(headlightGeo, headlightMat);
        group.add(rheadlight);
        rheadlight.position.set(-10,.5,-2.4);

        let rlight = new T.SpotLight("white", 1,20,Math.PI/8);
        group.add(rlight);
        rlight.position.set(-10,.5,-2.4);
        let rTarget = new T.Object3D();
        rlight.target = rTarget;
        group.add(rTarget);
        rTarget.position.set(-20,.5,-2.4);

        let llight = new T.SpotLight("white", 1,20,Math.PI/8);
        group.add(llight);
        llight.position.set(-10,.5,2.4);
        let lTarget = new T.Object3D();
        llight.target = lTarget;
        group.add(lTarget);
        lTarget.position.set(-20,.5,2.4);

        let ltaillight = new T.Mesh(headlightGeo, taillightMat);
        group.add(ltaillight);
        ltaillight.position.set(8.5,.7,2.2);

        let rtaillight = new T.Mesh(headlightGeo, taillightMat);
        group.add(rtaillight);
        rtaillight.position.set(8.5,.7,-2.2);

        group.position.set(0,.12,0);
        group.scale.set(.08,.08,.08);

        group.setRotationFromAxisAngle(new T.Vector3(0,1,0),Math.atan2(4,1.66)+Math.PI/2);

        let object = new T.Group();
        object.add(group);

        super(`Car-${++carCount}`, object);
        this.car = object;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(1);
        this.ridePoint.rotateY(-Math.PI/2);
        group.add(this.ridePoint);
        this.rideable = this.ridePoint;

    }
    stepWorld(delta){
        this.car.translateX(4*(delta/1000));
        this.car.translateZ(1.66*(delta/1000));
        if(this.car.position.x > 20){
            this.car.position.set(-20,0,2.7);
        }
    }
}

let lumps = textureLoader.load("./assets/noise.png");

let alienCount = 0;
export class Alien extends GrObject{
    constructor(timeOffset){
        let torsoGeo = new T.CylinderGeometry(1,.3,1.4);
        let neckGeo = new T.CylinderGeometry(.1,.15,.5);
        let headGeo = new T.SphereGeometry(1);
        let chinGeo = new T.CylinderGeometry(.7,0,.6);
        let thighGeo = new T.CylinderGeometry(.2,.1,.8);
        let calfGeo = new T.CylinderGeometry(.1,.2,.8);
        let armGeo = new T.CylinderGeometry(.2,.1,1.4);
        let eyeGeo = new T.SphereGeometry(.45);

        let skinMat = new T.MeshStandardMaterial({color: 0x00FF00, roughness: 1, bumpMap: lumps, map: lumps});
        let eyeMat = new T.MeshStandardMaterial({color: "black", roughness: 0, metalness: 1});

        let group = new T.Group();

        let torso = new T.Mesh(torsoGeo, skinMat);
        torso.position.set(0,1.8,0);
        torso.scale.set(1,1,.6);
        torso.rotateX(Math.PI/10);
        group.add(torso);

        let neck = new T.Mesh(neckGeo, skinMat);
        neck.position.set(0,2.8,-.1);
        neck.rotateX(Math.PI/12);
        group.add(neck);

        let headJoint = new T.Group();
        headJoint.position.set(0,3.05,0);
        headJoint.rotateX(-Math.PI/16);
        group.add(headJoint);

        let head = new T.Mesh(headGeo, skinMat);
        head.position.set(0,.9,.35);
        headJoint.add(head);

        let chin = new T.Mesh(chinGeo, skinMat);
        chin.position.set(0,-.1,.6);
        chin.rotateX(-Math.PI/13);
        headJoint.add(chin);

        let rightLegJoint = new T.Group();
        rightLegJoint.position.set(-.3,1.1,-.2);
        rightLegJoint.rotateX(-Math.PI/12);
        group.add(rightLegJoint);

        let rightThigh = new T.Mesh(thighGeo, skinMat);
        rightThigh.position.set(0,-.2,0);
        rightLegJoint.add(rightThigh);

        let leftLegJoint = new T.Group();
        leftLegJoint.position.set(.3,1.1,-.2);
        leftLegJoint.rotateX(-Math.PI/12);
        group.add(leftLegJoint);

        let leftThigh = new T.Mesh(thighGeo, skinMat);
        leftThigh.position.set(0,-.2,0);
        leftLegJoint.add(leftThigh);

        let rightCalfJoint = new T.Group();
        rightCalfJoint.position.set(0,-.6,0);
        rightCalfJoint.rotateX(Math.PI/6);
        rightLegJoint.add(rightCalfJoint);

        let rightCalf = new T.Mesh(calfGeo, skinMat);
        rightCalf.position.set(0,-.2,0);
        rightCalfJoint.add(rightCalf);

        let leftCalfJoint = new T.Group();
        leftCalfJoint.position.set(0,-.6,0);
        leftCalfJoint.rotateX(Math.PI/6);
        leftLegJoint.add(leftCalfJoint);

        let leftCalf = new T.Mesh(calfGeo, skinMat);
        leftCalf.position.set(0,-.2,0);
        leftCalfJoint.add(leftCalf);

        let rightShoulderJoint = new T.Group();
        rightShoulderJoint.position.set(-.9,2.5,0);
        rightShoulderJoint.rotateZ(-Math.PI/16);
        group.add(rightShoulderJoint);

        let rightArm = new T.Mesh(armGeo, skinMat);
        rightArm.position.set(0,-.65,0);
        rightShoulderJoint.add(rightArm);

        let leftShoulderJoint = new T.Group();
        leftShoulderJoint.position.set(.9,2.5,0);
        leftShoulderJoint.rotateZ(Math.PI/16);
        group.add(leftShoulderJoint);

        let leftArm = new T.Mesh(armGeo, skinMat);
        leftArm.position.set(0,-.65,0);
        leftShoulderJoint.add(leftArm);

        let rightElbowJoint = new T.Group();
        rightElbowJoint.position.set(0,-1.3,0);
        rightElbowJoint.rotateX(-Math.PI/10);
        rightElbowJoint.rotateZ(-Math.PI/10);
        rightShoulderJoint.add(rightElbowJoint);

        let rightForearm = new T.Mesh(armGeo, skinMat);
        rightForearm.position.set(0,-.7,0);
        rightElbowJoint.add(rightForearm);

        let leftElbowJoint = new T.Group();
        leftElbowJoint.position.set(0,-1.3,0);
        leftElbowJoint.rotateX(-Math.PI/10);
        leftElbowJoint.rotateZ(Math.PI/10);
        leftShoulderJoint.add(leftElbowJoint);

        let leftForearm = new T.Mesh(armGeo, skinMat);
        leftForearm.position.set(0,-.7,0);
        leftElbowJoint.add(leftForearm);

        let rightEye = new T.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(-.4,.6,.9);
        rightEye.scale.set(1,1.3,1);
        headJoint.add(rightEye);

        let leftEye = new T.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(.4,.6,.9);
        leftEye.scale.set(1,1.3,1);
        headJoint.add(leftEye);

        let center = new T.Group();
        center.add(group);

        group.scale.set(.06,.06,.06);
        super(`Alien-${++alienCount}`, center);
        this.body = group;
        this.neck = headJoint;
        this.rShoulder = rightShoulderJoint;
        this.lShoulder = leftShoulderJoint;
        this.rElbow = rightElbowJoint;
        this.lElbow = leftElbowJoint;
        this.rHip = rightLegJoint;
        this.lHip = leftLegJoint;
        this.rKnee = rightCalfJoint;
        this.lKnee = leftCalfJoint;
        this.time = timeOffset;
        this.pathTime = timeOffset;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(3);
        this.body.add(this.ridePoint);
        this.rideable = this.ridePoint;
    }
    stepWorld(delta){
        this.time += delta/80;
        this.time %= 2*Math.PI;

        this.pathTime += delta/1000;
        this.pathTime %= 20;

        //animating arms and legs
        this.rHip.setRotationFromAxisAngle(new T.Vector3(1,0,0),.5*Math.sin(this.time));
        this.rKnee.setRotationFromAxisAngle(new T.Vector3(1,0,0),.5+.5*Math.sin(this.time));

        this.lHip.setRotationFromAxisAngle(new T.Vector3(1,0,0),.5*Math.sin(Math.PI+this.time));
        this.lKnee.setRotationFromAxisAngle(new T.Vector3(1,0,0),.5+.5*Math.sin(Math.PI+this.time));

        this.rShoulder.setRotationFromAxisAngle(new T.Vector3(1,0,0),.5*Math.sin(Math.PI+this.time));
        this.rElbow.setRotationFromAxisAngle(new T.Vector3(1,0,0),-.5+.5*Math.sin(Math.PI+this.time));

        this.lShoulder.setRotationFromAxisAngle(new T.Vector3(1,0,0),.5*Math.sin(this.time));
        this.lElbow.setRotationFromAxisAngle(new T.Vector3(1,0,0),-.5+.5*Math.sin(this.time));

        let t = this.pathTime/20;
        let p0 = [-5,-3];
        let p1 = [0, 0];
        let p2 = [19, -4];
        let p3 = [7, 45];
        // find derivatives at the segment endpoints using a cardinal spline
        let pp1 = [.5*(p2[0]-p0[0]),.5*(p2[1]-p0[1])];
        let pp2 = [.5*(p3[0]-p1[0]),.5*(p3[1]-p1[1])];
        let p = [p1[0] + pp1[0] * t + (-3 * p1[0] - 2 * pp1[0] + 3 * p2[0] - pp2[0]) * t * t + (2 * p1[0] + pp1[0] - 2 * p2[0] + pp2[0]) * t * t * t, // x position
                p1[1] + pp1[1] * t + (-3 * p1[1] - 2 * pp1[1] + 3 * p2[1] - pp2[1]) * t * t + (2 * p1[1] + pp1[1] - 2 * p2[1] + pp2[1]) * t * t * t, // y position
                pp1[0] + (-3 * p1[0] - 2 * pp1[0] + 3 * p2[0] - pp2[0]) * t * 2 + (2 * p1[0] + pp1[0] - 2 * p2[0] + pp2[0]) * t * t * 3, // x derivative
                pp1[1] + (-3 * p1[1] - 2 * pp1[1] + 3 * p2[1] - pp2[1]) * t * 2 + (2 * p1[1] + pp1[1] - 2 * p2[1] + pp2[1]) * t * t * 3]; // y derivative

        // whole body movement. also bobbing
        this.body.setRotationFromAxisAngle(new T.Vector3(0,1,0),Math.atan2(p[2],p[3]));
        this.body.position.set(p[0],.008*Math.sin(this.time), p[1]);
    }
}

let cowTex = textureLoader.load("./assets/spot_texture.png");
let cowObj = await objLoader.loadAsync("./assets/spot_triangulated.obj");
let cowObj2 = await objLoader.loadAsync("./assets/spot_triangulated.obj");

cowObj.traverse(function (child) {
    if (child instanceof T.Mesh) {
        child.material.map = cowTex;
    }
} );

let auraMat = new T.MeshStandardMaterial({color: 0xff0000});
cowObj2.traverse(function (child) {
    if (child instanceof T.Mesh) {
        child.material = auraMat;
    }
} );

const rayHeight = 0;
let flashTime = 500;
let cowCount = 0;
export class Cow extends GrObject{
    constructor(xpos, zpos, theta, index){ 
        let center = new T.Vector3(10.5, 0 ,-2);
        
        let cowmodel = cowObj.clone(); 
        let cow = new T.Group();
        cow.add(cowmodel);
        cowmodel.scale.set(.3,.3,.3);
        cowmodel.position.set(0,.22,0);
        cowmodel.rotateY(Math.PI);

        let cowAura = cowObj2.clone();
        cow.add(cowAura);
        cowAura.scale.set(.35,.35,.35);
        cowAura.position.set(0,.21,0);
        cowAura.rotateY(Math.PI);
        cowAura.visible = false;

        super(`Cow-${++cowCount}`, cow);

        cow.position.set(xpos + center.x, 0, zpos + center.z);
        cow.rotateY(theta);

        let ctimer = 0;

        this.ctimer = ctimer;
        this.cow = cow;
        this.aura = cowAura;
        this.friends = [];
        this.raycasters = [];
        this.index = index;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(.7);
        this.cow.add(this.ridePoint);
        this.rideable = this.ridePoint;
    }
    setFriends(friends, bound){
        this.friends = friends;
        for (let i = 0; i < this.friends.length; i++){
            const other = this.friends[i].cow;
            let dir = new T.Vector3(other.position.x - this.cow.position.x, 0, other.position.z - this.cow.position.z);
            dir = dir.normalize();
            if (i != this.index){
                let rc = new T.Raycaster(new T.Vector3(this.cow.position.x, rayHeight, this.cow.position.z), dir, 0, 32);
                this.raycasters.push(rc);
            } else {
                this.raycasters.push(null);
            }
        }
    }
    stepWorld(delta){
        let speed = Number(speedSlider.value);

        // random boid steering
        let currentVec = new T.Vector3();
        this.cow.getWorldDirection(currentVec);
        let currentAngle = Math.atan2(currentVec.x, currentVec.z);

        let randomDraw = Math.floor(50 * Math.random()); // 1 in 50 chance to turn slightly
        if (randomDraw == 0){
            let change = .3 - .6 * Math.random(); // change size: +-.3
            this.cow.rotateOnWorldAxis(new T.Vector3(0,1,0),change);
        }

        // stay in bounds
        const bound = 7.7;
        let center = new T.Vector3(10.5, 0 ,-2);
        let relx = this.cow.position.x - center.x;
        let relz = this.cow.position.z - center.z;
        if (relx < -bound){
            this.cow.position.set(center.x - bound, 0, this.cow.position.z);
            this.cow.rotateOnAxis(new T.Vector3(0,1,0),2);
            this.ctimer = flashTime;
        }
        if (relx > bound){
            this.cow.position.set(center.x + bound, 0, this.cow.position.z);
            this.cow.rotateOnAxis(new T.Vector3(0,1,0),2);
            this.ctimer = flashTime;
        }
        if (relz < -bound){
            this.cow.position.set(this.cow.position.x, 0, center.z - bound);
            this.cow.rotateOnAxis(new T.Vector3(0,1,0),2);
            this.ctimer = flashTime;
        }
        if (relz > bound){
            this.cow.position.set(this.cow.position.x, 0, center.z + bound);
            this.cow.rotateOnAxis(new T.Vector3(0,1,0),2);
            this.ctimer = flashTime;
        }

        // boid collision
        let nearby = [];
        let verynearby = [];
        let cowsize = .25;
        for (let i = 0; i < this.friends.length; i++){
            if (i !== this.index){
                let thisx = this.cow.position.x;
                let thisz = this.cow.position.z;
                let thatx = this.friends[i].cow.position.x;
                let thatz = this.friends[i].cow.position.z;

                if (collisionCheck.checked){
                    //update raycasters (if toggle is on)
                    const other = this.friends[i].cow;
                    let dir = new T.Vector3(other.position.x - this.cow.position.x, 0, other.position.z - this.cow.position.z);
                    dir = dir.normalize();
                    this.raycasters[i].set(new T.Vector3(this.cow.position.x, rayHeight, this.cow.position.z), dir);
                    //collision with raycasters
                    let myIntersect = this.raycasters[i].intersectObject(this.cow)[0];
                    let otherIntersect = this.raycasters[i].intersectObject(this.friends[i].cow)[0];
                    if (myIntersect && otherIntersect){
                        let dist = otherIntersect.distance - myIntersect.distance;
                        console.log(dist);
                        if (dist <= .5){
                            // we collided
                            let xdir = thisx-thatx;
                            let zdir = thisz-thatz;
                            let angle = Math.atan2(xdir, zdir);
                            this.cow.setRotationFromAxisAngle(new T.Vector3(0,1,0), angle);
                            this.ctimer = flashTime;
                        }
                    }
                    

                } else { // use distances
                    if ((Math.abs(thisx-thatx) <= cowsize)&&(Math.abs(thisz-thatz) <= cowsize)){ 
                        let xdir = thisx-thatx;
                        let zdir = thisz-thatz;
                        let angle = Math.atan2(xdir, zdir);
                        this.cow.setRotationFromAxisAngle(new T.Vector3(0,1,0), angle);
                        this.ctimer = flashTime;
                    }
                }

                // keep track of nearby boids that will influence steering
                const distance = Number(distanceSlider.value);
                if (Math.sqrt((thisx-thatx)*(thisx-thatx)+(thisz-thatz)*(thisz-thatz)) <= distance){
                    nearby.push(this.friends[i]);
                }
                if (Math.sqrt((thisx-thatx)*(thisx-thatx)+(thisz-thatz)*(thisz-thatz)) <= distance/4){
                    verynearby.push(this.friends[i]);
                }
            }
        }

        // boid alignment
        let alignment = Number(alignmentSlider.value);
        let avgxv = 0.0;
        let avgzv = 0.0;
        let dir = new T.Vector3();
        let mydir = new T.Vector3();
        this.cow.getWorldDirection(mydir);
        nearby.forEach (function (boid){
            boid.cow.getWorldDirection(dir);
            avgxv += dir.x;
            avgzv += dir.z;
        });

        if (nearby.length != 0){
            avgxv = avgxv/nearby.length;
            avgzv = avgzv/nearby.length;
        } else {
            dir = mydir;
            avgxv = dir.x;
            avgzv = dir.z;
        }

        let desiredAngle = Math.atan2(avgxv, avgzv);
        currentAngle = Math.atan2(mydir.x,mydir.z);
        let change;
        if (Math.abs(desiredAngle-currentAngle) > Math.PI){
            change = -alignment*(desiredAngle-currentAngle)/75;
        } else {
            change = alignment*(desiredAngle-currentAngle)/75;
        }
        currentAngle += change;
        this.cow.setRotationFromAxisAngle(new T.Vector3(0,1,0), currentAngle);

        // boid separation
        let separation = Number(separationSlider.value);
        let me = this.cow;
        let thisx = me.position.x;
        let thisz = me.position.z;
        verynearby.forEach (function (boid){
            let xdir = thisx - boid.cow.position.x;
            let zdir = thisz - boid.cow.position.z;
            let separationTheta = Math.atan2(xdir,zdir);
            let separationAmt;
            if (Math.abs(separationTheta-currentAngle) > Math.PI){
                separationAmt = -separation*(separationTheta-currentAngle)/200;
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
        nearby.forEach (function (boid){
            avgx += boid.cow.position.x;
            avgz += boid.cow.position.y;
        });

        if (nearby.length != 0){
            avgx = avgx/nearby.length;
            avgz = avgz/nearby.length;
            let cohesionAngle = Math.atan2(avgx-thisx, avgz-thisz);
            let cohesionAmount;
            if (Math.abs(cohesionAngle-currentAngle) > Math.PI){
                cohesionAmount = -cohesion*(cohesionAngle-currentAngle)/100;
            } else {
                cohesionAmount = cohesion*(cohesionAngle-currentAngle)/100;
            }
            currentAngle += cohesionAmount;
            me.setRotationFromAxisAngle(new T.Vector3(0,1,0), currentAngle);
        }  

        // move the boid
        this.cow.translateZ(delta/5000 * speed);
        this.ctimer -= delta;

        if(this.ctimer > 0){
            this.aura.visible = true;
        } else {
            this.aura.visible = false;
        }

    }
}

let abductedCowCount = 0;
export class AbductedCow extends GrObject{
    constructor(){
        let thiscow = cowObj.clone(); 
        let cow = new T.Group();
        cow.add(thiscow);
        cow.scale.set(.3,.3,.3);
        thiscow.position.set(0,.7,0);
        thiscow.rotateY(Math.PI);
        super(`Abducted Cow-${++abductedCowCount}`, cow);
        this.cow = cow;
        this.time = 0;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(1);
        this.cow.add(this.ridePoint);
        this.rideable = this.ridePoint;
    }
    stepWorld(delta){
        this.time += delta/1000;
        this.time = this.time % 14;
        if (this.time < 5){
            this.cow.translateZ(.001*delta);
        }
        if (5 < this.time && this.time < 11){
            this.cow.translateY(.001*delta);
        }
        if (11 < this.time && this.time < 14){
            this.cow.position.set(10.5,0,-11.4);
        }
    }
}

let scooterCount = 0;
export class Scooter extends GrObject{
    constructor(offset){
        let scooter = new T.Group();
        let obj = new T.Group();

        let metal = new T.MeshStandardMaterial({color: 0xa6a6a6, roughness: .2, metalness: .6});
        let rubber = new T.MeshStandardMaterial({color: 0x752226, roughness: .5, metalness: 0});

        let baseGeo = new T.BoxGeometry(4,.12,.7);
        let wheelGeo = new T.CylinderGeometry(.3,.3,.27);
        let stickGeo = new T.CylinderGeometry(.1,.1,3);
        let handleGeo = new T.CylinderGeometry(.1,.1,1);
        let gripGeo = new T.CylinderGeometry(.12,.12,.6);

        let base = new T.Mesh(baseGeo, metal);
        base.position.set(0,.45,0);
        scooter.add(base);

        let frontWheel = new T.Mesh(wheelGeo, rubber);
        frontWheel.position.set(1.6,.3,0);
        frontWheel.rotateX(Math.PI/2)
        scooter.add(frontWheel);

        let rearWheel = new T.Mesh(wheelGeo, rubber);
        rearWheel.position.set(-1.6,.3,0);
        rearWheel.rotateX(Math.PI/2)
        scooter.add(rearWheel);

        let stick = new T.Mesh(stickGeo, metal);
        stick.position.set(1.6,2,0);
        scooter.add(stick);

        let handle = new T.Mesh(handleGeo, metal);
        handle.position.set(1.6,3.5,0);
        handle.rotateX(Math.PI/2);
        scooter.add(handle);

        let leftGrip = new T.Mesh(gripGeo, rubber);
        leftGrip.position.set(1.6,3.5,.6);
        leftGrip.rotateX(Math.PI/2);
        scooter.add(leftGrip);

        let rightGrip = new T.Mesh(gripGeo, rubber);
        rightGrip.position.set(1.6,3.5,-.6);
        rightGrip.rotateX(Math.PI/2);
        scooter.add(rightGrip);

        scooter.scale.set(.07,.07,.07);
        obj.add(scooter);

        let torsoGeo = new T.CylinderGeometry(1,.3,1.4);
        let neckGeo = new T.CylinderGeometry(.1,.15,.5);
        let headGeo = new T.SphereGeometry(1);
        let chinGeo = new T.CylinderGeometry(.7,0,.6);
        let thighGeo = new T.CylinderGeometry(.2,.1,.8);
        let calfGeo = new T.CylinderGeometry(.1,.2,.8);
        let armGeo = new T.CylinderGeometry(.2,.1,1.4);
        let eyeGeo = new T.SphereGeometry(.45);

        let skinMat = new T.MeshStandardMaterial({color: 0x00FF00, roughness: 1, bumpMap: lumps, map: lumps});
        let eyeMat = new T.MeshStandardMaterial({color: "black", roughness: 0, metalness: 1});

        let group = new T.Group();

        let torso = new T.Mesh(torsoGeo, skinMat);
        torso.position.set(0,1.8,0);
        torso.scale.set(1,1,.6);
        torso.rotateX(Math.PI/10);
        group.add(torso);

        let neck = new T.Mesh(neckGeo, skinMat);
        neck.position.set(0,2.8,-.1);
        neck.rotateX(Math.PI/12);
        group.add(neck);

        let headJoint = new T.Group();
        headJoint.position.set(0,3.05,0);
        headJoint.rotateX(-Math.PI/16);
        group.add(headJoint);

        let head = new T.Mesh(headGeo, skinMat);
        head.position.set(0,.9,.35);
        headJoint.add(head);

        let chin = new T.Mesh(chinGeo, skinMat);
        chin.position.set(0,-.1,.6);
        chin.rotateX(-Math.PI/13);
        headJoint.add(chin);

        let rightLegJoint = new T.Group();
        rightLegJoint.position.set(-.3,1.1,-.2);
        rightLegJoint.rotateX(-Math.PI/12);
        group.add(rightLegJoint);

        let rightThigh = new T.Mesh(thighGeo, skinMat);
        rightThigh.position.set(0,-.2,0);
        rightLegJoint.add(rightThigh);

        let leftLegJoint = new T.Group();
        leftLegJoint.position.set(.3,1.1,-.2);
        leftLegJoint.rotateX(-Math.PI/12);
        group.add(leftLegJoint);

        let leftThigh = new T.Mesh(thighGeo, skinMat);
        leftThigh.position.set(0,-.2,0);
        leftLegJoint.add(leftThigh);

        let rightCalfJoint = new T.Group();
        rightCalfJoint.position.set(0,-.6,0);
        rightCalfJoint.rotateX(Math.PI/6);
        rightLegJoint.add(rightCalfJoint);

        let rightCalf = new T.Mesh(calfGeo, skinMat);
        rightCalf.position.set(0,-.2,0);
        rightCalfJoint.add(rightCalf);

        let leftCalfJoint = new T.Group();
        leftCalfJoint.position.set(0,-.6,0);
        leftCalfJoint.rotateX(Math.PI/6);
        leftLegJoint.add(leftCalfJoint);

        let leftCalf = new T.Mesh(calfGeo, skinMat);
        leftCalf.position.set(0,-.2,0);
        leftCalfJoint.add(leftCalf);

        let rightShoulderJoint = new T.Group();
        rightShoulderJoint.position.set(-.9,2.5,0);
        rightShoulderJoint.rotateZ(-Math.PI/16);
        group.add(rightShoulderJoint);

        let rightArm = new T.Mesh(armGeo, skinMat);
        rightArm.position.set(0,-.65,0);
        rightShoulderJoint.add(rightArm);

        let leftShoulderJoint = new T.Group();
        leftShoulderJoint.position.set(.9,2.5,0);
        leftShoulderJoint.rotateZ(Math.PI/16);
        group.add(leftShoulderJoint);

        let leftArm = new T.Mesh(armGeo, skinMat);
        leftArm.position.set(0,-.65,0);
        leftShoulderJoint.add(leftArm);

        let rightElbowJoint = new T.Group();
        rightElbowJoint.position.set(0,-1.3,0);
        rightElbowJoint.rotateX(-Math.PI/10);
        rightShoulderJoint.add(rightElbowJoint);

        let rightForearm = new T.Mesh(armGeo, skinMat);
        rightForearm.position.set(0,-.7,0);
        rightElbowJoint.add(rightForearm);

        let leftElbowJoint = new T.Group();
        leftElbowJoint.position.set(0,-1.3,0);
        leftElbowJoint.rotateX(-Math.PI/10);
        leftShoulderJoint.add(leftElbowJoint);

        let leftForearm = new T.Mesh(armGeo, skinMat);
        leftForearm.position.set(0,-.7,0);
        leftElbowJoint.add(leftForearm);

        let rightEye = new T.Mesh(eyeGeo, eyeMat);
        rightEye.position.set(-.4,.6,.9);
        rightEye.scale.set(1,1.3,1);
        headJoint.add(rightEye);

        let leftEye = new T.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(.4,.6,.9);
        leftEye.scale.set(1,1.3,1);
        headJoint.add(leftEye);

        obj.add(group);
        group.translateY(.02);
        group.translateX(-.02);

        leftLegJoint.rotateX(-Math.PI/6);
        leftCalfJoint.rotateX(Math.PI/3);

        leftShoulderJoint.rotateX(-Math.PI/2);
        leftShoulderJoint.rotateY(Math.PI/9);
        leftElbowJoint.rotateX(-Math.PI/4);

        rightShoulderJoint.rotateX(-Math.PI/2-.05);
        rightElbowJoint.rotateX(-Math.PI/4);

        rightLegJoint.translateY(-.15);

        let center = new T.Group();
        scooter.rotateY(-Math.PI/2);
        group.scale.set(0.06,0.06,0.06);
        
        center.add(obj);

        super(`Scooter Alien-${++scooterCount}`, center);

        this.body = obj;
        this.neck = headJoint;
        this.rShoulder = rightShoulderJoint;
        this.lShoulder = leftShoulderJoint;
        this.rElbow = rightElbowJoint;
        this.lElbow = leftElbowJoint;
        this.rHip = rightLegJoint;
        this.lHip = leftLegJoint;
        this.rKnee = rightCalfJoint;
        this.lKnee = leftCalfJoint;
        this.time = offset*offset;
        this.pathTime = offset;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(.2);
        obj.add(this.ridePoint);
        this.rideable = this.ridePoint;

    }
    stepWorld(delta){
        this.time += delta/300;
        this.time %= 2*Math.PI;

        this.pathTime += delta/1000;
        this.pathTime %= 20;

        this.rHip.setRotationFromAxisAngle(new T.Vector3(1,0,0),.5*Math.sin(this.time));
        this.rKnee.setRotationFromAxisAngle(new T.Vector3(1,0,0),.5+.5*Math.sin(this.time));

        this.neck.setRotationFromAxisAngle(new T.Vector3(0,0,1),.2*-Math.sin(this.time));

        let t = this.pathTime/20*4;

        let p0 = [-17, 13];
        let p1 = [-16, 7];
        let p2 = [-9, 13];
        let p3 = [-11, 8];
        let temp;

        function cycle(times){
            for (let i = 0; i < times; i++){
                temp = p0
                p0 = p1;
                p1 = p2;
                p2 = p3;
                p3 = temp;
            }
        }

        if (t<1){
        } else if (t<2){
            t-=1;
            cycle(1);
        } else if (t<3) {
            t-=2;
            cycle(2);
        } else {
            t-=3;
            cycle(3);
        }

        let pp1 = [.5*(p2[0]-p0[0]),.5*(p2[1]-p0[1])];
        let pp2 = [.5*(p3[0]-p1[0]),.5*(p3[1]-p1[1])];
        let p = [p1[0] + pp1[0] * t + (-3 * p1[0] - 2 * pp1[0] + 3 * p2[0] - pp2[0]) * t * t + (2 * p1[0] + pp1[0] - 2 * p2[0] + pp2[0]) * t * t * t, // x position
                p1[1] + pp1[1] * t + (-3 * p1[1] - 2 * pp1[1] + 3 * p2[1] - pp2[1]) * t * t + (2 * p1[1] + pp1[1] - 2 * p2[1] + pp2[1]) * t * t * t, // y position
                pp1[0] + (-3 * p1[0] - 2 * pp1[0] + 3 * p2[0] - pp2[0]) * t * 2 + (2 * p1[0] + pp1[0] - 2 * p2[0] + pp2[0]) * t * t * 3, // x derivative
                pp1[1] + (-3 * p1[1] - 2 * pp1[1] + 3 * p2[1] - pp2[1]) * t * 2 + (2 * p1[1] + pp1[1] - 2 * p2[1] + pp2[1]) * t * t * 3]; // y derivative

        this.body.setRotationFromAxisAngle(new T.Vector3(0,1,0),Math.atan2(p[2],p[3]));
        this.body.position.set(p[0],0, p[1]);
    }
}

let saucerCount = 0;
export class Saucer extends GrObject{
    constructor(legsActive, envMap){
        let moving = !legsActive;

        let saucer = new T.Group();

        let metal = new T.MeshStandardMaterial({color: 0xa6a6a6, roughness: .2, metalness: .6});
        let glass = new T.MeshStandardMaterial({color: 0x80e3ff, roughness: 0, metalness: .5, envMap: envMap});
        let rubber = new T.MeshStandardMaterial({color: 0x303030, roughness: .6, metalness: 0});
        let redLight = new T.MeshStandardMaterial({color: "red", emissive: "red"});
        let greenLight = new T.MeshStandardMaterial({color: "green", emissive: "green"});

        let bodyGeo = new T.TorusGeometry(2,1);
        let body = new T.Mesh(bodyGeo, metal);
        body.scale.set(.8,.8,.6);
        body.rotateX(Math.PI/2);
        saucer.add(body);

        let ringGeo = new T.CylinderGeometry(3.3,2.5,.5);
        let ring = new T.Mesh(ringGeo, metal);
        saucer.add(ring);

        let bottomGeo = new T.SphereGeometry(1.8);
        let bottom = new T.Mesh(bottomGeo, metal);
        bottom.position.set(0,.2,0);
        bottom.scale.set(1,.7,1);
        saucer.add(bottom);

        let domeGeo = new T.SphereGeometry(1.6);
        let dome = new T.Mesh(domeGeo, glass);
        dome.position.set(0,.7,0);
        dome.scale.set(1,.7,1);
        saucer.add(dome);

        // lights
        let lightGeo = new T.SphereGeometry(.2);

        let l1 = new T.Mesh(lightGeo, redLight);
        l1.position.set(2.7*Math.cos(Math.PI/3),0,2.7*Math.sin(Math.PI/3));
        saucer.add(l1);

        let l2 = new T.Mesh(lightGeo, greenLight);
        l2.position.set(2.7*Math.cos(2*Math.PI/3),0,2.7*Math.sin(2*Math.PI/3));
        saucer.add(l2);

        let l3 = new T.Mesh(lightGeo, redLight);
        l3.position.set(2.7*Math.cos(3*Math.PI/3),0,2.7*Math.sin(3*Math.PI/3));
        saucer.add(l3);

        let l4 = new T.Mesh(lightGeo, greenLight);
        l4.position.set(2.7*Math.cos(4*Math.PI/3),0,2.7*Math.sin(4*Math.PI/3));
        saucer.add(l4);

        let l5 = new T.Mesh(lightGeo, redLight);
        l5.position.set(2.7*Math.cos(5*Math.PI/3),0,2.7*Math.sin(5*Math.PI/3));
        saucer.add(l5);

        let l6 = new T.Mesh(lightGeo, greenLight);
        l6.position.set(2.7*Math.cos(6*Math.PI/3),0,2.7*Math.sin(6*Math.PI/3));
        saucer.add(l6);

        // legs because i just realized it needs WHEELS

        if (legsActive){      
        let stickGeo = new T.CylinderGeometry(.05,.13,2);
        let wheelGeo = new T.CylinderGeometry(.2,.2,.23);

        let leg1 = new T.Group();
        let stick1 = new T.Mesh(stickGeo, metal);
        leg1.add(stick1);
        stick1.position.set(0,-1,0);
        leg1.position.set(2.3,0,0);
        leg1.rotateZ(Math.PI/6);
        saucer.add(leg1);

        let wheel1 = new T.Mesh(wheelGeo, rubber);
        wheel1.position.set(0,-2,0);
        wheel1.rotateZ(-Math.PI/6 + Math.PI/2);
        leg1.add(wheel1);

        let leg2 = new T.Group();
        let stick2 = new T.Mesh(stickGeo, metal);
        leg2.add(stick2);
        stick2.position.set(0,-1,0);
        leg2.position.set(0,0,2.3);
        leg2.rotateX(-Math.PI/6);
        saucer.add(leg2);

        let wheel2 = new T.Mesh(wheelGeo, rubber);
        wheel2.position.set(0,-2,0);
        wheel2.rotateX(Math.PI/6 + Math.PI/2);
        wheel2.rotateZ(Math.PI/2);
        leg2.add(wheel2);

        let leg3 = new T.Group();
        let stick3 = new T.Mesh(stickGeo, metal);
        leg3.add(stick3);
        stick3.position.set(0,-1,0);
        leg3.position.set(-2.3,0,0);
        leg3.rotateZ(-Math.PI/6);
        saucer.add(leg3);

        let wheel3 = new T.Mesh(wheelGeo, rubber);
        wheel3.position.set(0,-2,0);
        wheel3.rotateZ(Math.PI/6 + Math.PI/2);
        leg3.add(wheel3);

        let leg4 = new T.Group();
        let stick4 = new T.Mesh(stickGeo, metal);
        leg4.add(stick4);
        stick4.position.set(0,-1,0);
        leg4.position.set(0,0,-2.3);
        leg4.rotateX(Math.PI/6);
        saucer.add(leg4);

        let wheel4 = new T.Mesh(wheelGeo, rubber);
        wheel4.position.set(0,-2,0);
        wheel4.rotateX(-Math.PI/6 + Math.PI/2);
        wheel4.rotateZ(Math.PI/2);
        leg4.add(wheel4);
        } else {
            let light = new T.SpotLight(0x00FFFF, 10,12,Math.PI/7);
            let target = new T.Group();
            target.position.set(0,-12,0);
            light.target = target;
            saucer.add(target);
            light.castShadow = true;
            saucer.add(light);
            light.position.set(0,-1,0);
        }

        let beamGeo = new T.CylinderGeometry(.7,.7,11,32,100);
        let beamMat = shaderMaterial("./assets/beam.vs", "./assets/beam.fs", {
            side: 0,
            uniforms: {time: {value: 0.0}},
            transparent: true,
          });
        let beam = new T.Mesh(beamGeo, beamMat);
        beam.visible = false;
        beam.position.set(0,-5.5,0);
        saucer.add(beam);

        let light = new T.PointLight(0x00FFFF, 5, 10);
        if (!legsActive){
            saucer.add(light);
            light.position.set(0,-5.5,0);
        }

        saucer.scale.set(.6,.6,.6);
        let group = new T.Group();
        group.add(saucer);
        saucer.position.set(0,1.1,0);
        super(`Saucer-${++saucerCount}`, group);
        this.group = group;
        this.saucer = saucer;
        this.moving = moving;
        this.time = 3;
        this.floatTime = 0;
        this.beam = beam;
        this.beamMat = beamMat;
        this.light = light;

        this.ridePoint = new T.Object3D();
        if (!legsActive){
            this.ridePoint.translateY(1);
            this.saucer.add(this.ridePoint);
            this.rideable = this.ridePoint;
        }
    }
    stepWorld(delta){
        this.beam.castShadow = false;
        this.beam.receiveShadow = false;
        this.light.castShadow = false;

        this.time += delta/1000;
        this.time = this.time % 14;

        this.floatTime += delta/1000;
        this.floatTime = this.floatTime % (Math.PI*2);

        this.beamMat.uniforms.time.value = (this.time - 8)/6;

        // want saucer to circle for 8 seconds and then stay for 6
        if (this.moving){
            this.saucer.rotateY(delta/2000);
            this.ridePoint.rotateY(-delta/2000);
            this.saucer.position.set(this.saucer.position.x, .3*Math.sin(this.floatTime), this.saucer.position.z);
            
            if (this.time < 8){
                this.beam.visible = false;
                this.light.visible = false;
                this.saucer.position.set(14*Math.cos(this.time*Math.PI/4), .3*Math.sin(this.floatTime)+4+4*Math.sin(this.time*Math.PI/4-Math.PI/2), 7*Math.sin(this.time*Math.PI/4));
            }
            if (8 < this.time && this.time < 14){
                this.beam.visible = true;
                this.light.visible = true;
                this.light.intensity = 5*(-4*((this.time - 8)/6)*((this.time - 8)/6)+4*((this.time - 8)/6));
            }
        }
    }
}