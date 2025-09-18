/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

let boundaryCount = 0;
export class Boundary extends GrObject {
    constructor(s){ // s is size
        let geometry = new T.BufferGeometry();

        const h = 1; // height

        const vertices = new Float32Array([
            -s,0,-s,
            s,0,-s,
            -s,h,-s,

            -s,h,-s,
            s,0,-s,
            s,h,-s,


            s,0,-s,
            s,0,s,
            s,h,-s,

            s,h,-s,
            s,0,s,
            s,h,s,


            s,0,s,
            -s,0,s,
            s,h,s,

            s,h,s,
            -s,0,s,
            -s,h,s,


            -s,0,s,
            -s,0,-s,
            -s,h,s,

            -s,h,s,
            -s,0,-s,
            -s,h,-s
        ]);

        geometry.setAttribute('position',new T.BufferAttribute(vertices,3));
        geometry.computeVertexNormals();

        let material = new T.MeshStandardMaterial({color: 0xFF0000, side: 2});

        let mesh = new T.Mesh(geometry, material);
        let group = new T.Group();
        group.add(mesh);

        super(`Boundary-${++boundaryCount}`, group);
    }
}