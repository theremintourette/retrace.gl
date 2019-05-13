import ObjLoader from 'obj-mtl-loader';
import {vec3} from 'gl-matrix';

import {geometryTypes} from '../../bvh';

import {
    range,
    defined,
    definedNotNull,
    normedColor,
    isHexColor,
    glslFloat
} from '../../utils';

class Volume {
    includeInBvh = true;

    constructor({material, minCoords, maxCoords}) {
        this.material = material;
        // this.texture = texture;
        // this.radius = radius;

        // this.position = {
        //     x: 0,
        //     y: 0,
        //     z: 0,
        //     ...(defined(position)
        //         ? position
        //         : [])
        // };

        this.minCoords = {
            x: 0,
            y: 0,
            z: 0,
            ...(defined(minCoords)
                ? minCoords
                : [])
        };

        this.maxCoords = {
            x: 0,
            y: 0,
            z: 0,
            ...(defined(maxCoords)
                ? maxCoords
                : [])
        };
    }

    get geometryData() {
        console.log('geo type: ' + geometryTypes.volumeAabb);
        let geoData = [
            // vec3 v0
            this.minCoords.x,
            this.minCoords.y,
            this.minCoords.z,

            // vec3 v1
            this.maxCoords.x,
            this.maxCoords.y,
            this.maxCoords.z,

            // vec3 v2
            -1,
            -1,
            -1,

            // vec3 n0
            -1,
            -1,
            -1,

            // vec3 n1
            -1,
            -1,
            -1,

            // vec3 n2
            -1,
            -1,
            -1,

            // vec3 t0
            -1,
            -1,
            -1,

            // vec3 t1
            -1,
            -1,
            -1,

            // vec3 t2
            -1,
            -1,
            -1,

            // vec3 meta1
            this.material.materialId,
            0, // smooth shading
            geometryTypes.volumeAabb,

            // vec3 meta2
            -1,
            -1,
            -1
        ]

        console.dir(geoData);
        return geoData;
    }
}

export default Volume;