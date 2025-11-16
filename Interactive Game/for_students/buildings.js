/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

import * as Text2D from "../libs/CS559-Three/examples/jsm/webxr/Text2D.js";

let loader = new T.TextureLoader();
let fieldtex = loader.load("./assets/field.png");
let fieldtex2 = loader.load("./assets/field2.png");
let fieldtex3 = loader.load("./assets/field3.png");

// Text that updates based on the state of the game
let textCount = 0;
export class Text extends GrObject {
    constructor(camera, alien){
        // "center" will be at the exact same point as the camera at all times
        // text objects will be added to it and offset slightly so that they're visible on the screen
        let center = new T.Group();

        let mesh0 = Text2D.createText("You are the alien. Move with WASD.", .004);  
        // set where the text appears on the screen
        center.add(mesh0);
        mesh0.translateZ(-.1);
        mesh0.translateX(-.02);
        mesh0.translateY(.036);

        let mesh1 = Text2D.createText("Move near a cow, and pick it up with E.", .004);  
        // set where the text appears on the screen
        center.add(mesh1);
        mesh1.translateZ(-.1);
        mesh1.translateX(-.018);
        mesh1.translateY(.031);

        let mesh2 = Text2D.createText("You can drop it with Q, or throw it by pressing E again.", .004);  
        // set where the text appears on the screen
        center.add(mesh2);
        mesh2.translateZ(-.1);
        mesh2.translateX(-.005);
        mesh2.translateY(.036);

        let mesh3 = Text2D.createText("Try to carry or throw all the cows to the spaceship.", .004);  
        // set where the text appears on the screen
        center.add(mesh3);
        mesh3.translateZ(-.1);
        mesh3.translateX(-.008);
        mesh3.translateY(.036);

        let mesh4 = Text2D.createText("Try not to let any escape the fence!", .004);  
        // set where the text appears on the screen
        center.add(mesh4);
        mesh4.translateZ(-.1);
        mesh4.translateX(-.021);
        mesh4.translateY(.031);

        let meshCounter = Text2D.createText(" ", .004);  
        // set where the text appears on the screen
        center.add(meshCounter);
        meshCounter.translateZ(-.1);
        meshCounter.translateY(.036);

        let meshEnd = Text2D.createText("No more cows remaining!", .004);  
        // set where the text appears on the screen
        center.add(meshEnd);
        meshEnd.translateZ(-.1);
        meshEnd.translateY(.036);

        super(`Text-${++textCount}`, center);

        // update text based on the alien, and update position/rotation based on the camera
        this.alien = alien;
        this.cam = camera;

        // all of the different text objects that can appear on the screen
        // control which ones are visible at any given time in stepWorld()
        this.hud = center;
        this.text0 = mesh0;
        this.text1 = mesh1;
        this.text2 = mesh2;
        this.text3 = mesh3;
        this.text4 = mesh4;
        this.textCounter = meshCounter;
        this.textEnd = meshEnd;

        // fields for controlling which text is on screen
        this.interactCount = 0; // how many times the alien has interacted with a cow
        this.wasCarrying = false; // used for updating interactCount
        this.updateTimer = 0; // timer to control when we update the score text. more information below
        this.globalTimer = 0; // timer that starts when the first cow is interacted with. displayed to the user on the end screen
        this.finishedFlag = false; // keeps track of if all the cows are gone
    }

    // Updates the "score counter" text so it changes based on how many cows were caught / lost
    // The text in a Text2D object can't be changed, so we have to make a new object every time we update
    // This is costly, so it's done on a timer instead of every frame.
    updateCounter(caught, lost){
        let newCounter = Text2D.createText(caught + " cow(s) abducted, " + lost + " cow(s) escaped", .004);  
        newCounter.translateZ(-.1);
        newCounter.translateY(.036);

        // remember to remove the old counter so we don't end up with lots of objects!
        this.hud.remove(this.textCounter);
        this.hud.add(newCounter);
        this.textCounter = newCounter;
    }

    // Called once the player has collected/lost all the cows. Creates a new text object that shows the results.
    tallyResults(caught, lost, time){
        const total = caught + lost;
        const timeInSec = time/1000;
        let resultsText = Text2D.createText("You abducted " + caught + " out of " + total + " cows in " + timeInSec + " seconds!", .004);  
        resultsText.translateZ(-.1);
        resultsText.translateY(.031);

        this.hud.add(resultsText);
    }

    // Called every frame by the GrWorld
    stepWorld(delta){
        // update the timer that will be shown to the player when they finish
        this.globalTimer += delta;

        // update the text that displays how many cows are caught
        // this is costly (must create a whole new text object), so only do it once every second
        this.updateTimer += delta;
        if ((this.interactCount > 2) && (this.updateTimer > 1000)){
            this.updateCounter(this.alien.caughtCount, this.alien.lostCount);
            this.updateTimer = 0;
        }

        // update the text so it's in the same spot relative to the camera
        this.hud.position.set(this.cam.position.x, this.cam.position.y, this.cam.position.z);
        this.hud.setRotationFromEuler(this.cam.rotation);
        console.log(this.interactCount);

        // keep track of how many times the player has interacted with a cow to control which text is shown
        if (this.wasCarrying != this.alien.carrying){
            this.wasCarrying = !this.wasCarrying;
            this.interactCount++;
        }

        // change which text is shown based on interactCount, finishedFlag, and the number of cows caught/lost
        if (this.finishedFlag == true){ // all cows are gone, player is finished
            this.textCounter.visible = false;
        } else if (this.interactCount == 0){ // tell the player the movement controls
            this.text0.visible = true;
            this.text1.visible = true;
            this.text2.visible = false;
            this.text3.visible = false;
            this.text4.visible = false;
            this.textCounter.visible = false;
            this.textEnd.visible = false;

            // before the player has picked up any cows, stop the global timer from updating
            // so they can have time to figure out how to move first!
            this.globalTimer = 0;
        } else if (this.interactCount == 1){ // tell the player how to drop/throw
            this.text0.visible = false;
            this.text1.visible = false;
            this.text2.visible = true;
        } else if (this.interactCount == 2){ // tell the player the goal of the game
            this.text2.visible = false;
            this.text3.visible = true;
            this.text4.visible = true;
        } else if (this.interactCount > 2){ // show the player's current score
            this.text3.visible = false;
            this.text4.visible = false;
            this.textCounter.visible = true;

            // the player has collected/lost all the cows. make the end text visible and set the finishedFlag
            // 20 is the total number of cows. ideally this would be defined in a more global place
            if ((this.alien.caughtCount + this.alien.lostCount) >= 20 && this.finishedFlag == false){
                this.textCounter.visible = false;
                this.textEnd.visible = true;
                this.tallyResults(this.alien.caughtCount, this.alien.lostCount, this.globalTimer);
                this.finishedFlag = true;
            }
        }

    }
}

// All the objects below here are just decorations! They don't affect the game at all.

let fenceCount = 0;
export class Fence extends GrObject {
    constructor(size){
        let group = new T.Group();
        let mat = new T.MeshStandardMaterial({color: "white"});

        let postGeo = new T.CylinderGeometry(.2,.3,2);
        let sideGeo = new T.BoxGeometry(46 * size,.4,.2);

        for (let i = 0; i < 24 * size; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set(2*i,1,0);
            group.add(mesh);
        }

        let sideA = new T.Mesh(sideGeo, mat);
        sideA.position.set(23 * size,1.5,0);
        group.add(sideA);
        let sideA2 = new T.Mesh(sideGeo, mat);
        sideA2.position.set(23 * size,.8,0);
        group.add(sideA2);

        for (let i = 0; i < 24 * size; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set(2*i,1,46 * size);
            group.add(mesh);
        }

        let sideB = new T.Mesh(sideGeo, mat);
        sideB.position.set(23 * size,1.5,46 * size);
        group.add(sideB);
        let sideB2 = new T.Mesh(sideGeo, mat);
        sideB2.position.set(23 * size,.8,46 * size);
        group.add(sideB2);

        for (let i = 0; i < 24 * size; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set(0,1,2*i);
            group.add(mesh);
        }

        let sideC = new T.Mesh(sideGeo, mat);
        sideC.rotateY(Math.PI/2);
        sideC.position.set(0,1.5,23 * size);
        group.add(sideC);
        let sideC2 = new T.Mesh(sideGeo, mat);
        sideC2.rotateY(Math.PI/2);
        sideC2.position.set(0,.8,23 * size);
        group.add(sideC2);

        for (let i = 0; i < 24 * size; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set((48 - 2) * size,1,2*i);
            group.add(mesh);
        }

        let sideD = new T.Mesh(sideGeo, mat);
        sideD.rotateY(Math.PI/2);
        sideD.position.set(46 * size,1.5,23 * size);
        group.add(sideD);
        let sideD2 = new T.Mesh(sideGeo, mat);
        sideD2.rotateY(Math.PI/2);
        sideD2.position.set(46 * size,.8,23 * size);
        group.add(sideD2);

        group.scale.set(.15,.15,.15);
        super(`Fence-${++fenceCount}`, group);
    }
}

let fieldCount = 0;
export class WheatField extends GrObject{
    constructor(cropCircles){
        let group = new T.Group();

        let geo = new T.PlaneGeometry(10,10,200,200);
        let mat = new T.MeshStandardMaterial({color: 0xe1ed72, side: 1, map: fieldtex});

        // procedurally deform the plane to make it look like a wheat field
        let uvs = geo.attributes.uv.array;
        let verts = geo.attributes.position.array;
        for (let i = 0; i < uvs.length/2; i++){
            let u = uvs[2*i];
            let v = uvs[2*i+1];
            // verts[3*i+2] is y value. negative is farther up
            verts[3*i+2] = -.2*Math.random();
            let last = 0;
            if (i > 0){
                last = verts[3*(i-1)+2];
            }

            if (cropCircles == 1){
                mat.map = fieldtex2;

                let cu = u - .5;
                let cv = v - .5;
                let minDist = .075;
                let maxDist = .125;
                let dist = Math.sqrt(cu*cu+cv*cv);
                let isTall = verts[3*i+2] < -.18;
                if (dist > minDist && dist < maxDist && isTall){ //inner ring
                    verts[3*i+2] = -.179;
                }
                minDist = .25;
                maxDist = .3;
                if (dist > minDist && dist < maxDist && isTall){ // outer ring
                    verts[3*i+2] = -.179;
                }

                cu = u - .225; // move to other circle
                dist = Math.sqrt(cu*cu+cv*cv);
                minDist = .1;
                maxDist = .15;
                if (dist > minDist && dist < maxDist && isTall){
                    verts[3*i+2] = -.179;
                }

                cu = u - .775; // move to other circle
                dist = Math.sqrt(cu*cu+cv*cv);
                if (dist > minDist && dist < maxDist && isTall){
                    verts[3*i+2] = -.179;
                }
                
                cu = u - .5; // move to other circle
                cv = v - .225;
                dist = Math.sqrt(cu*cu+cv*cv);
                minDist = 0;
                maxDist = .1;
                if (dist > minDist && dist < maxDist && isTall){
                    verts[3*i+2] = -.179;
                }

                cv = v - .775; // move to other circle
                dist = Math.sqrt(cu*cu+cv*cv);
                minDist = 0;
                maxDist = .1;
                if (dist > minDist && dist < maxDist && isTall){
                    verts[3*i+2] = -.179;
                }
            } else if (cropCircles == 2){
                mat.map = fieldtex3;
                let cu = u - .5;
                let cv = v - .5;
                let minDist = .4;
                let maxDist = .5;
                let dist = Math.sqrt(cu*cu+cv*cv);
                let isTall = verts[3*i+2] < -.18;
                if (dist > minDist && dist < maxDist && isTall){ //outer ring
                    verts[3*i+2] = -.179;
                }

                minDist = .25;
                maxDist = .3;
                if (dist > minDist && dist < maxDist && isTall){ //inner ring
                    verts[3*i+2] = -.179;
                }

                maxDist = .1;
                if (dist < maxDist && isTall){ //inner circle
                    verts[3*i+2] = -.179;
                }

                cu = u - .225; // move to other circle
                dist = Math.sqrt(cu*cu+cv*cv);
                minDist = 0;
                maxDist = .1;
                if (dist > minDist && dist < maxDist && isTall){
                    verts[3*i+2] = -.179;
                }

                cu = u - .775; // move to other circle
                dist = Math.sqrt(cu*cu+cv*cv);
                if (dist > minDist && dist < maxDist && isTall){
                    verts[3*i+2] = -.179;
                }
                
                cu = u - .5; // move to other circle
                cv = v - .225;
                dist = Math.sqrt(cu*cu+cv*cv);
                minDist = 0;
                maxDist = .1;
                if (dist > minDist && dist < maxDist && isTall){
                    verts[3*i+2] = -.179;
                }

                cv = v - .775; // move to other circle
                dist = Math.sqrt(cu*cu+cv*cv);
                minDist = 0;
                maxDist = .1;
                if (dist > minDist && dist < maxDist && isTall){
                    verts[3*i+2] = -.179;
                }
            }

            // make "stalks" out of the vertices that are tall enough
            if (verts[3*i+2] < -.18 && last > -.8){
                verts[3*i+2] = -.8;
            }

            // pinch down the edges
            if (u == 0 || u == 1 || v == 0 || v == 1){
                verts[3*i+2] = 0;
            }
        }

        let plain = new T.Mesh(geo, mat);
        plain.rotateX(Math.PI/2);
        group.add(plain);
        group.scale.set(.7,.5,.7);

        super(`Wheat Field-${++fieldCount}`, group);
    }
}

let swarmCount = 0;
export class Fireflies extends GrObject{
    constructor(offset){
        let bound = 6;

        let tex = loader.load("./assets/firefly.png")
        let group = new T.Group();
        let center = new T.Group();
        center.position.set(0,1.5,0);
        let flyMat = new T.SpriteMaterial({map: tex});
        let flyMat2 = new T.SpriteMaterial({map: tex});
        let flies = [];
        let directions = [];
        for (let i = 0; i < 20; i++){
            let x = -bound+2*bound*Math.random();
            let y = -bound+bound*Math.random();
            let z = -bound+2*bound*Math.random();
            let fly;
            if (i%2==0){
               fly = new T.Sprite(flyMat);
            } else {
               fly = new T.Sprite(flyMat2);
            }
            fly.scale.set(.1,.1,.1);
            center.add(fly);
            flies.push(fly);
            fly.position.set(x,y,z);
            let direction = new T.Vector3(Math.random()-.5, Math.random()-.5, Math.random()-.5).normalize();
            directions.push(direction);
        }
        center.scale.set(.5,.5,.5);
        group.add(center);
        super(`Firefly Swarm-${++swarmCount}`, group);
        this.flies = flies;
        this.dirs = directions;
        this.bound = bound;
        this.timer = offset;
        this.mat1 = flyMat;
        this.mat2 = flyMat2;
    }
    stepWorld(delta){
        for (let i = 0; i < this.flies.length; i++){

            let fly = this.flies[i];
            fly.receiveShadow = false;
            let dir = this.dirs[i];

            this.timer += delta/10000;
            this.timer %= 2*Math.PI;

            this.mat1.opacity = .5+.5*Math.sin(this.timer);
            this.mat2.opacity = .5+.5*Math.cos(this.timer);

            let x = fly.position.x;
            let y = fly.position.y;
            let z = fly.position.z;
            fly.translateOnAxis(dir, delta/2000);
            if (Math.abs(x) > this.bound || Math.abs(y) > this.bound/2 || Math.abs(x) > this.bound ){
                this.dirs[i] = this.dirs[i].multiplyScalar(-1);
            }
            let buffer = .1;
            if (x > this.bound){
                fly.position.set(this.bound-buffer,y,z);
            }
            if (x < -this.bound){
                fly.position.set(-this.bound+buffer,y,z);
            }
            if (y > this.bound/2){
                fly.position.set(x,this.bound/2-buffer,z);
            }
            if (y < -this.bound/2){
                fly.position.set(x,-this.bound/2+buffer,z);
            }
            if (z > this.bound){
                fly.position.set(x,y,this.bound-buffer);
            }
            if (z < -this.bound){
                fly.position.set(x,y,-this.bound+buffer);
            }
        }

    }
}