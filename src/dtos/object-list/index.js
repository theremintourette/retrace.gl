import {
    definedNotNull,
    normedColor,
    isHexColor,
    isFn
} from '../../utils';

function ObjectList(hitables) {
    this.objIdCounter = 0;
    this.hitables = [];

    this.initialize = (hitables) => {
        if(!hitables.length) {
            return;
        }

        hitables.forEach(hitable =>
            hitable.id = this.objIdCounter++
        );

        this.hitables = hitables;
    }

    this.length = () =>
        this.hitables.length;

    this.get = (i) =>
        this.hitables[i];

    this.add = (hitable) => {
        hitable.id = this.objIdCounter++;
        this.hitables.push(hitable);
    }

    this.updateTextureColors = (__uv, __p) =>
        this.hitables
            .map(hitable =>
                hitable.updateTextureColor(__uv, __p)
            ).join('');

    this.getTextureDefinitions = () =>
        this.hitables
            .map(hitable =>
                hitable.getTextureDefinition()
            ).join('');

    this.getDefinition = () => `
        Hitable hitables[${this.hitables.length}];
        {
            ${this.hitables.map((hitable, i) => `
                hitables[${i}] = ${hitable.getDefinition()}
            `).join('')}
        }
    `;

    this.initialize(hitables);
};

export default ObjectList;
