/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

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