/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

// get our inputs from the html page

const textureLoader = new T.TextureLoader();
const objLoader = new OBJLoader();

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

cowObj.traverse(function (child) {
    if (child instanceof T.Mesh) {
        child.material.map = cowTex;
    }
} );

let cowCount = 0;
export class Cow extends GrObject{
    constructor(){    

        let thiscow = cowObj.clone(); 
        let cow = new T.Group();
        cow.add(thiscow);
        cow.scale.set(.3,.3,.3);
        cow.position.set(0,.22,0);
        thiscow.rotateY(Math.PI);

        let center = new T.Group();
        center.add(cow);

        super(`Cow-${++cowCount}`, center);

        this.cow = cow;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(.7);
        this.cow.add(this.ridePoint);
        this.rideable = this.ridePoint;
    }
    stepWorld(delta){
        let amount = (-.5 + Math.random())/900;

        let dist = 3;
        let buffer = .1;

        this.cow.rotateY(amount * delta);
        this.cow.translateZ(.0003 * delta);
        if (Math.abs(this.cow.position.x) > dist || Math.abs(this.cow.position.z) > dist){
            this.cow.rotateY(Math.PI);
        }
        if (this.cow.position.x > dist){
            this.cow.position.set(dist-buffer, .22, this.cow.position.z);
        }
        if (this.cow.position.x < -1*dist){
            this.cow.position.set(-dist+buffer, .22, this.cow.position.z);
        }
        if (this.cow.position.z > dist){
            this.cow.position.set(this.cow.position.x, .22, dist-buffer);
        }
        if (this.cow.position.z < -1*dist){
            this.cow.position.set(this.cow.position.x, .22, -dist+buffer);
        }
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
            this.saucer.position.set(this.saucer.position.x, .3*Math.sin(this.floatTime), this.saucer.position.z);
        }
    }
}