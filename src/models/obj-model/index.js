import ObjLoader from 'obj-mtl-loader';
import {vec3} from 'gl-matrix';

import {encodeObjModelTriangleVertexData} from '../../model-encoders/obj';

import {
    range,
    defined,
    definedNotNull,
    isObj,
    normedColor,
    isHexColor,
    glslFloat
} from '../../utils';

class ObjModel {
    includeInBvh = true;

    constructor({
        url,
        material,
        texture,
        normalMap,
        scale,
        position,
        rotation,
        smoothShading,
        doubleSided,
        flipNormals
    }) {
        this.url = url;
        this.material = material;

        this.texture = texture;
        this.textureUvScale = {
            x: 1,
            y: 1,
            ...(defined(texture) && defined(texture.uvScale)
                ? texture.uvScale.x || texture.uvScale.y
                    ? texture.uvScale
                    : {x: texture.uvScale, y: texture.uvScale}
                : [])
        };

        this.normalMap = normalMap;
        this.normalMapScale = {
            x: 1,
            y: 1,
            ...(defined(normalMap) && defined(normalMap.scale)
                ? normalMap.scale.x || normalMap.scale.y
                    ? normalMap.scale
                    : {x: normalMap.scale, y: normalMap.scale}
                : [])
        };
        this.normalMapUvScale = {
            x: 1,
            y: 1,
            ...(defined(normalMap) && defined(normalMap.uvScale)
                ? normalMap.uvScale.x || normalMap.uvScale.y
                    ? normalMap.uvScale
                    : {x: normalMap.uvScale, y: normalMap.uvScale}
                : [])
        };

        this._geometryData = null;

        this.smoothShading = defined(smoothShading)
            ? smoothShading
            : false;

        this.doubleSided = defined(doubleSided)
            ? doubleSided
            : false;

        this.flipNormals = defined(flipNormals)
            ? flipNormals
            : false;

        this.scale = isObj(scale)
            ? {
                x: 0,
                y: 0,
                z: 0,
                ...(defined(scale)
                    ? scale
                    : [])
            }
            : defined(scale)
                ? scale
                : 1;

        this.position = {
            x: 0,
            y: 0,
            z: 0,
            ...(defined(position)
                ? position
                : [])
        };

        this.rotation = {
            x: 0,
            y: 0,
            z: 0,
            ...(defined(rotation)
                ? rotation
                : [])
        };

        // "await new Obj()"
        return (async () => {
            this.mesh = await this.loadModel();
            return this;
        })();
    }

    get geometryData() {
        if(!this._geometryData) {
            this._geometryData = encodeObjModelTriangleVertexData({
                mesh: this.mesh,
                scale: this.scale,
                position: this.position,
                rotation: this.rotation,
                materialId: this.material.materialId,
                textureId: defined(this.texture)
                    ? this.texture.textureId
                    : -1,
                textureUvScale: this.textureUvScale,
                normalMapId: defined(this.normalMap)
                    ? this.normalMap.textureId
                    : -1,
                normalMapScale: this.normalMapScale,
                normalMapUvScale: this.normalMapUvScale,
                smoothShading: this.smoothShading,
                doubleSided: this.doubleSided,
                flipNormals: this.flipNormals
            });
        }

        return this._geometryData;
    }

    async loadModel() {
        return new Promise((resolve, reject) => {
            const objLoader = new ObjLoader();
            objLoader.load(this.url, (err, mesh) => {
                if(definedNotNull(err)) {
                    reject(err);
                }

                resolve(mesh);
            });
        });
    }
}

export default ObjModel;
