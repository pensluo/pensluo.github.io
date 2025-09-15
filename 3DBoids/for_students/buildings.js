/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// define your buildings here - remember, they need to be imported
// into the "main" program

let loader = new T.TextureLoader();

let gableGeo = new T.BufferGeometry();

const vertices = new Float32Array([
    -1,-.5,.7,
    1,-.5,.7,
    -1,.5,.7,

    1,-.5,.7,
    1,.5,.7,
    -1,.5,.7,


    1,-.5,.7,
    1,-.5,-.7,
    1,.5,.7,

    1,-.5,-.7,
    1,.5,-.7,
    1,.5,.7,


    1,-.5,-.7,
    -1,-.5,-.7,
    1,.5,-.7,

    -1,-.5,-.7,
    -1,.5,-.7,
    1,.5,-.7,


    -1,-.5,-.7,
    -1,-.5,.7,
    -1,.5,-.7,

    -1,-.5,.7,
    -1,.5,.7,
    -1,.5,-.7,


    -1,-.5,.7,
    -1,-.5,-.7,
    1,-.5,.7,

    1,-.5,.7,
    -1,-.5,-.7,
    1,-.5,-.7,

    // roof front
    -1,.5,.7,
    1,.5,.7,
    -1,1.2,0,

    1,.5,.7,
    1,1.2,0,
    -1,1.2,0,

    // roof right
    1,.5,.7,
    1,.5,-.7,
    1,1.2,0,

    // roof back
    -1,.5,-.7,
    -1,1.2,0,
    1,.5,-.7,

    1,.5,-.7,
    -1,1.2,0,
    1,1.2,0,

    // roof left
    -1,.5,-.7,
    -1,.5,.7,
    -1,1.2,0,
]);
gableGeo.setAttribute('position',new T.BufferAttribute(vertices,3));
gableGeo.computeVertexNormals();

const uvs = new Float32Array([
    // front
    .2,0,
    .8,0,
    .2,.25,

    .8,0,
    .8,.25,
    .2,.25,

    // right
    0,0,
    0,0,
    0,0,

    0,0,
    0,0,
    0,0,

    //back
    0,0,
    .4,0,
    0,.25,

    .4,0,
    .4,.25,
    0,.25,

    //left
    0,0,
    0,0,
    0,0,

    0,0,
    0,0,
    0,0,

    //bottom
    0,0,
    0,0,
    0,0,

    0,0,
    0,0,
    0,0,

    //roof front
    0,.25,
    1,.25,
    0,1,

    1,.25,
    1,1,
    0,1,

    // roof right
    0,0,
    0,0,
    0,0,

    // roof back
    1,.25,
    1,1,
    0,.25,

    0,.25,
    1,1,
    0,1,

    // roof left
    0,0,
    0,0,
    0,0,
]);
gableGeo.setAttribute('uv',new T.BufferAttribute(uvs,2));

let singleFenceCount = 0;
export class SingleFence extends GrObject{
    constructor(){
        let group = new T.Group();
        let tex = loader.load("./assets/wood.png");
        let mat = new T.MeshStandardMaterial({map: tex});

        let postGeo = new T.CylinderGeometry(.2,.3,3);
        let sideGeo = new T.BoxGeometry(140,.4,.2);

        for (let i = 0; i < 71; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set(2*i,1,0);
            group.add(mesh);
        }

        let sideA = new T.Mesh(sideGeo, mat);
        sideA.position.set(70,2,0);
        group.add(sideA);
        let sideA2 = new T.Mesh(sideGeo, mat);
        sideA2.position.set(70,1,0);
        group.add(sideA2);

        group.scale.set(.15,.15,.15);
        super(`Single Fence-${++singleFenceCount}`, group);
    }
}

let smallRoadCount = 0;
export class SmallRoad extends GrObject{
    constructor(length){
        let group = new T.Group();
        let tl = loader.load("./assets/concrete.png");
        let tl2 = loader.load("./assets/concretenorm.png");
        let tl3 = loader.load("./assets/roadalpha.png");

        tl.wrapS = T.RepeatWrapping;
        tl.wrapT = T.RepeatWrapping;
        tl.repeat.set(length,1);
        tl2.wrapS = T.RepeatWrapping;
        tl2.wrapT = T.RepeatWrapping;
        tl2.repeat.set(length,1);
        tl3.wrapS = T.RepeatWrapping;
        tl3.wrapT = T.RepeatWrapping;
        tl3.repeat.set(length,1);

        let geo = new T.PlaneGeometry(length,1.2);
        let mat = new T.MeshStandardMaterial({color: 0xc7b591, map: tl, normalMap: tl2, alphaMap: tl3, transparent: true});

        let mesh = new T.Mesh(geo, mat);
        mesh.position.set(0,0.005,-length/2);
        mesh.rotateY(Math.PI/2);
        mesh.rotateX(-Math.PI/2);
        group.add(mesh);
        super(`Small Road-${++smallRoadCount}`, group);
        this.road = mesh;
    }
    stepWorld(){
        this.road.castShadow = false;
    }
}

let farmhouseCount = 0;
export class Farmhouse extends GrObject{
    constructor(){
        let group = new T.Group();
        let tex = loader.load("./assets/housewithshingles.png");
        let material = new T.MeshStandardMaterial({color: "white", roughness: 0.75, map: tex});
        let seg1 = new T.Mesh(gableGeo, material);
        group.add(seg1);
        seg1.scale.set(.7,.7,.7);
        seg1.position.set(0,.3,0);
        let seg2 = new T.Mesh(gableGeo, material);
        group.add(seg2);
        seg2.position.set(.255,.3,.7);
        seg2.rotateY(-Math.PI/2);
        seg2.scale.set(.7,.7,.6);
        super(`Farmhouse-${++farmhouseCount}`, group);
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

let roadCount = 0;
export class Road extends GrObject{
    constructor(){
        let group = new T.Group();

        let tl = loader.load("./assets/concrete.png");
        let tl2 = loader.load("./assets/concretenorm.png");
        let tl3 = loader.load("./assets/roadalpha.png");

        tl.wrapS = T.RepeatWrapping;
        tl.wrapT = T.RepeatWrapping;
        tl.repeat.set(24,1);
        tl2.wrapS = T.RepeatWrapping;
        tl2.wrapT = T.RepeatWrapping;
        tl2.repeat.set(24,1);
        tl3.wrapS = T.RepeatWrapping;
        tl3.wrapT = T.RepeatWrapping;
        tl3.repeat.set(24,1);

        let geo = new T.PlaneGeometry(44,1.5);
        let mat = new T.MeshStandardMaterial({color: 0xc7b591, map: tl, normalMap: tl2, alphaMap: tl3, transparent: true});

        let mesh = new T.Mesh(geo, mat);
        mesh.position.set(0,0.01,11);
        mesh.rotateY(-Math.PI/8);
        mesh.rotateX(-Math.PI/2);
        group.add(mesh);

        super(`Road-${++roadCount}`, group);
        this.road = mesh;
    }
    stepWorld(){
        this.road.castShadow = false;
    }
}

let fieldtex = loader.load("./assets/field.png");
let fieldtex2 = loader.load("./assets/field2.png");
let fieldtex3 = loader.load("./assets/field3.png");

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

let fenceCount = 0;
export class Fence extends GrObject {
    constructor(){
        let group = new T.Group();
        let mat = new T.MeshStandardMaterial();

        let postGeo = new T.CylinderGeometry(.2,.3,2);
        let sideGeo = new T.BoxGeometry(46,.4,.2);

        for (let i = 0; i < 24; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set(2*i,1,0);
            group.add(mesh);
        }

        let sideA = new T.Mesh(sideGeo, mat);
        sideA.position.set(23,1.5,0);
        group.add(sideA);
        let sideA2 = new T.Mesh(sideGeo, mat);
        sideA2.position.set(23,.8,0);
        group.add(sideA2);

        for (let i = 0; i < 24; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set(2*i,1,46);
            group.add(mesh);
        }

        let sideB = new T.Mesh(sideGeo, mat);
        sideB.position.set(23,1.5,46);
        group.add(sideB);
        let sideB2 = new T.Mesh(sideGeo, mat);
        sideB2.position.set(23,.8,46);
        group.add(sideB2);

        for (let i = 0; i < 24; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set(0,1,2*i);
            group.add(mesh);
        }

        let sideC = new T.Mesh(sideGeo, mat);
        sideC.rotateY(Math.PI/2);
        sideC.position.set(0,1.5,23);
        group.add(sideC);
        let sideC2 = new T.Mesh(sideGeo, mat);
        sideC2.rotateY(Math.PI/2);
        sideC2.position.set(0,.8,23);
        group.add(sideC2);

        for (let i = 0; i < 24; i++){
            let mesh = new T.Mesh(postGeo, mat);
            mesh.position.set(48 - 2,1,2*i);
            group.add(mesh);
        }

        let sideD = new T.Mesh(sideGeo, mat);
        sideD.rotateY(Math.PI/2);
        sideD.position.set(46,1.5,23);
        group.add(sideD);
        let sideD2 = new T.Mesh(sideGeo, mat);
        sideD2.rotateY(Math.PI/2);
        sideD2.position.set(46,.8,23);
        group.add(sideD2);

        group.scale.set(.15,.15,.15);
        super(`Fence-${++fenceCount}`, group);
    }
}

let silotex = loader.load("./assets/8bs-wall_seamless_a_1024.png");

let siloCount = 0;
export class Silo extends GrObject {
    constructor(height){
        let silo = new T.Group();

        let cylinderGeo = new T.CylinderGeometry(1,1,5 * height,8,1);
        let topGeo = new T.SphereGeometry(1,8,8);

        let cylinderMat = new T.MeshStandardMaterial({color: 0xc2ab8a, map: silotex});
        let topMat = new T.MeshStandardMaterial({color: 0xBBBBBB, metalness: .6, roughness: .4});

        let cylinder = new T.Mesh(cylinderGeo, cylinderMat);
        let top = new T.Mesh(topGeo, topMat);

        silo.add(cylinder);
        silo.add(top);
        cylinder.position.set(0,2.5 * height,0);
        top.position.set(0,5 * height,0);
        silo.scale.set(.5,.5,.5);
        super(`Silo-${++siloCount}`, silo);
    }
}


// missing UVs
let boundaryCount = 0;
export class Boundary extends GrObject {
    constructor(){
        let geometry = new T.BufferGeometry();

        const h = .5;
        const vertices = new Float32Array([
            -8,0,-8,
            8,0,-8,
            -8,h,-8,

            -8,h,-8,
            8,0,-8,
            8,h,-8,


            8,0,-8,
            8,0,8,
            8,h,-8,

            8,h,-8,
            8,0,8,
            8,h,8,


            8,0,8,
            -8,0,8,
            8,h,8,

            8,h,8,
            -8,0,8,
            -8,h,8,


            -8,0,8,
            -8,0,-8,
            -8,h,8,

            -8,h,8,
            -8,0,-8,
            -8,h,-8
        ]);

        geometry.setAttribute('position',new T.BufferAttribute(vertices,3));
        geometry.computeVertexNormals();

        let material = new T.MeshStandardMaterial({color: 0xA67F4E, side: 2});

        let mesh = new T.Mesh(geometry, material);
        let group = new T.Group();
        group.add(mesh);

        super(`Boundary-${++boundaryCount}`, group);
    }
}

let hippedHouseCount = 0;
export class HippedHouse extends GrObject {
    constructor(){
        let geometry = new T.BufferGeometry();

        const vertices = new Float32Array([
            -1,-.5,.7,
            1,-.5,.7,
            -1,.5,.7,

            1,-.5,.7,
            1,.5,.7,
            -1,.5,.7,


            1,-.5,.7,
            1,-.5,-.7,
            1,.5,.7,

            1,-.5,-.7,
            1,.5,-.7,
            1,.5,.7,


            1,-.5,-.7,
            -1,-.5,-.7,
            1,.5,-.7,

            -1,-.5,-.7,
            -1,.5,-.7,
            1,.5,-.7,


            -1,-.5,-.7,
            -1,-.5,.7,
            -1,.5,-.7,

            -1,-.5,.7,
            -1,.5,.7,
            -1,.5,-.7,


            -1,-.5,.7,
            -1,-.5,-.7,
            1,-.5,.7,

            1,-.5,.7,
            -1,-.5,-.7,
            1,-.5,-.7,

            // roof
            -1,.5,.7,
            1,.5,.7,
            0,1.2,0,

            1,.5,.7,
            1,.5,-.7,
            0,1.2,0,

            1,.5,-.7,
            -1,.5,-.7,
            0,1.2,0,

            -1,.5,-.7,
            -1,.5,.7,
            0,1.2,0,
        ]);
        geometry.setAttribute('position',new T.BufferAttribute(vertices,3));
        geometry.computeVertexNormals();

        const uvs = new Float32Array([
            // front
            .2,0,
            .8,0,
            .2,.25,

            .8,0,
            .8,.25,
            .2,.25,

            // right
            0,0,
            0,0,
            0,0,

            0,0,
            0,0,
            0,0,

            //back
            0,0,
            .4,0,
            0,.25,

            .4,0,
            .4,.25,
            0,.25,

            //left
            0,0,
            0,0,
            0,0,

            0,0,
            0,0,
            0,0,

            //bottom
            0,0,
            0,0,
            0,0,

            0,0,
            0,0,
            0,0,

            //roof
            0,.25,
            1,.25,
            .5,1,

            0,.25,
            1,.25,
            .5,1,

            0,.25,
            1,.25,
            .5,1,

            0,.25,
            1,.25,
            .5,1,
        ]);
        geometry.setAttribute('uv',new T.BufferAttribute(uvs,2));

        let tl = new T.TextureLoader().load("./assets/housewithshingles.png");

        let material = new T.MeshStandardMaterial({color: 0xc2c4c4, roughness: 0.75, map: tl});

        let mesh = new T.Mesh(geometry, material);
        let group = new T.Group();
        group.add(mesh);
        mesh.scale.set(.7,.7,.7);
        mesh.position.set(0,.3,0);

        super(`HippedHouse-${++hippedHouseCount}`, group);
    }
}

let gableHouseCount = 0;
export class GableHouse extends GrObject{
    constructor(){
        let tl = new T.TextureLoader().load("./assets/housewithshingles.png");

        let material = new T.MeshStandardMaterial({color: 0xccb88b, roughness: 0.75, map: tl});

        let mesh = new T.Mesh(gableGeo, material);
        let group = new T.Group();
        group.add(mesh);
        mesh.scale.set(.7,.7,.7);
        mesh.position.set(0,.3,0);

        super(`GableHouse-${++gableHouseCount}`, group);
    }
}

let barntex = loader.load("./assets/barn.png");

let barnCount = 0;
export class Barn extends GrObject {
    constructor(){
        let geometry = new T.BufferGeometry();

        const vertices = new Float32Array([
            // front
            -2,0,2, //left
            -.7,0,2,
            -2,.7,2,

            -.7,0,2,
            -.7,1,2,
            -2,.7,2,

            -.7,0,2, // middle
            .7,0,2,
            -.7,1,2,

            .7,0,2,
            .7,1,2,
            -.7,1,2,

            -.7,1,2,
            .7,1,2,
            -.4,1.5,2,

            .7,1,2,
            .4,1.5,2,
            -.4,1.5,2,

            -.4,1.5,2,
            .4,1.5,2,
            0,1.7,2,

            .7,0,2, // right
            2,0,2,
            .7,1,2,

            2,0,2,
            2,.7,2,
            .7,1,2,

            // back
            -2,0,-1, //left
            -2,.7,-1,
            -.7,0,-1,

            -.7,0,-1,
            -2,.7,-1,
            -.7,1,-1,

            -.7,0,-1, // middle
            -.7,1,-1,
            .7,0,-1,

            .7,0,-1,
            -.7,1,-1,
            .7,1,-1,

            -.7,1,-1,
            -.4,1.5,-1,
            .7,1,-1,

            .7,1,-1,
            -.4,1.5,-1,
            .4,1.5,-1,

            -.4,1.5,-1,
            0,1.7,-1,
            .4,1.5,-1,

            .7,0,-1, // right
            .7,1,-1,
            2,0,-1,

            2,0,-1,
            .7,1,-1,
            2,.7,-1,

            // right
            2,0,2,
            2,0,-1,
            2,.7,2,

            2,0,-1,
            2,.7,-1,
            2,.7,2,

            // left
            -2,0,2,
            -2,.7,2,
            -2,0,-1,

            -2,0,-1,
            -2,.7,2,
            -2,.7,-1,

            // bottom
            -2,0,2,
            -2,0,-1,
            2,0,2,

            2,0,2,
            -2,0,-1,
            2,0,-1,

            // roof
            -2,.7,-1, // left
            -2,.7,2,
            -.7,1,-1,

            -2,.7,2,
            -.7,1,2,
            -.7,1,-1,

            -.7,1,-1, // center
            -.7,1,2,
            -.4,1.5,-1,

            -.7,1,2,
            -.4,1.5,2,
            -.4,1.5,-1,

            -.4,1.5,-1,
            -.4,1.5,2,
            0,1.7,-1,

            -.4,1.5,2,
            0,1.7,2,
            0,1.7,-1,

            0,1.7,-1,
            0,1.7,2,
            .4,1.5,-1,

            0,1.7,2,
            .4,1.5,2,
            .4,1.5,-1,

            .4,1.5,-1,
            .4,1.5,2,
            .7,1,-1,

            .4,1.5,2,
            .7,1,2,
            .7,1,-1,

            .7,1,-1,
            .7,1,2,
            2,.7,-1,

            .7,1,2,
            2,.7,2,
            2,.7,-1,
        ]);
        geometry.setAttribute('position',new T.BufferAttribute(vertices,3));
        geometry.computeVertexNormals();

        const uvs = new Float32Array([
            // front
            0,0, //left
            .27,0,
            0,.24,

            .27,0,
            .27,.31,
            0,.24,

            .27,0, // middle
            .73,0,
            .27,.31,

            .73,0,
            .73,.31,
            .27,.31,

            .27,.31,
            .73,.31,
            .36,.41,

            .73,.31,
            .64,.41,
            .36,.41,

            .36,.41,
            .64,.41,
            .5,.5,

            .73,0, // right
            1,0,
            .73,.31,

            1,0,
            1,.24,
           .73,.31,

            // back
            0,0, //left
            0,.24,
            .27,0,

            .27,0,
            0,.24,
            .27,.31,

            .27,0, // middle
            .27,.31,
            .73,0,

            .73,0,
            .27,.31,
            .73,.31,

            .27,.31,
            .36,.41,
            .73,.31,

            .73,.31,
            .36,.41,
            .64,.41,

            .36,.41,
            .5,.5,
            .64,.41,

            .73,0, // right
            .73,.31,
            1,0,

            1,0,
            .73,.31,
            1,.24,

            // right
            0,.5,
            1,.5,
            0,.75,

            1,.5,
            1,.75,
            0,.75,

            // left
            0,.5,
            0,.75,
            1,.5,

            1,.5,
            0,.75,
            1,.75,

            // bottom
            0,0,
            0,0,
            0,0,

            0,0,
            0,0,
            0,0,

            // roof
            0,.76, // left
            1,.76,
            0,1,

            1,.76,
            1,1,
            0,1,

            0,.76, // center
            1,.76,
            0,1,

            1,.76,
            1,1,
            0,1,

            0,.76,
            1,.76,
            0,1,

            1,.76,
            1,1,
            0,1,

            0,.76,
            1,.76,
            0,1,

            1,.76,
            1,1,
            0,1,

            0,.76,
            1,.76,
            0,1,

            1,.76,
            1,1,
            0,1,

            0,.76,
            1,.76,
            0,1,

            1,.76,
            1,1,
            0,1,
        ]);
        geometry.setAttribute('uv',new T.BufferAttribute(uvs,2));

        let material = new T.MeshStandardMaterial({color: "white", roughness: 0.75, map: barntex});

        let mesh = new T.Mesh(geometry, material);
        super(`Barn-${++barnCount}`, mesh);
    }
}

let barktex = loader.load("./assets/oakbark.jpg");
let barknorm = loader.load("./assets/oakbark_n.jpg");
barktex.wrapS = T.RepeatWrapping;
barktex.wrapT = T.RepeatWrapping;
barktex.repeat.set(4,4);
barknorm.wrapS = T.RepeatWrapping;
barknorm.wrapT = T.RepeatWrapping;
barknorm.repeat.set(4,4);

let leaftex = loader.load("./assets/groundcover.jpg");
let leafnorm = loader.load("./assets/groundcover_n.jpg");
leaftex.wrapS = T.RepeatWrapping;
leaftex.wrapT = T.RepeatWrapping;
leaftex.repeat.set(3,3);
leafnorm.wrapS = T.RepeatWrapping;
leafnorm.wrapT = T.RepeatWrapping;
leafnorm.repeat.set(3,3);

let oakCount = 0;
export class Oak extends GrObject{
    constructor(){
        let tree = new T.Group();

        let trunkgeo = new T.CylinderGeometry(.8,1.1,4);
        let trunkmat = new T.MeshStandardMaterial({map: barktex, normalMap: barknorm, color: 0xccb87e});
        let trunk = new T.Mesh(trunkgeo, trunkmat);
        trunk.position.y = 2;
        tree.add(trunk);

        let leaves = new T.Group()
        leaves.position.y = 4;
        tree.add(leaves);

        let leafmat = new T.MeshStandardMaterial({map: leaftex, normalMap: leafnorm, color: 0x4bb85b});

        let ballgeo = new T.SphereGeometry(1.75);

        let ball1 = new T.Mesh(ballgeo, leafmat);
        ball1.position.set(-1.55,0,0);
        ball1.scale.set(1.1,1.1,1.1);
        leaves.add(ball1);

        let ball2 = new T.Mesh(ballgeo, leafmat);
        ball2.position.set(1.55,0,0);
        ball2.scale.set(1.1,1.1,1.1);
        leaves.add(ball2);

        let ball3 = new T.Mesh(ballgeo, leafmat);
        ball3.position.set(0,1.7,0);
        leaves.add(ball3);

        let ball4 = new T.Mesh(ballgeo, leafmat);
        ball4.position.set(0,0,1.55);
        ball4.scale.set(1.1,1.1,1.1);
        leaves.add(ball4);

        let ball5 = new T.Mesh(ballgeo, leafmat);
        ball5.position.set(0,0,-1.55);
        ball5.scale.set(1.1,1.1,1.1);
        leaves.add(ball5);

        tree.scale.set(.2,.2,.2);
        super(`Oak-${++oakCount}`, tree);
    }
}