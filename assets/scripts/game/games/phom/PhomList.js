/**
 * Created by Thanh on 11/4/2016.
 */

import ArrayUtils from "ArrayUtils";

export default class PhomList {
    constructor(phoms) {
        this.owner = 0;
        this.renderComponent = null;
        this.cards = [];
        
        this.phoms = [];
        
        if (!ArrayUtils.isEmpty(phoms)) {
            this.push(...phoms);
        }
    }
    
    get length() {
        return this.phoms.length;    
    }
    
    isEmpty(){
        return this.cards.length == 0;
    }

    getPhomLengths() {
        return this.phoms.map(phom => phom.cards.length);
    }

    join(phomList) {
        phomList && this.phoms.push(...phomList);
    }

    push(...phoms) {
        this.phoms.push(...phoms);
        phoms.forEach(phom => phom.cards && this.cards.push(...phom.cards));
    }

    /**
     * this.length < 3 mean that only model created
     *
     * @param phom
     */
    add(phomModel) {
        this.push(phomModel);
    }

    getCards() {
        return this.cards;
    }

    clear() {
        window.release(this.cards);
        this.phoms.forEach(phom => phom.clear());
    }

    toBytes() {
        return this.cards.map(card => {
            return card.byteValue;
        });
    }

    equals(phomList) {
        if (this.length != phomList.length) return false;
        return ArrayUtils.containsAll(this.phoms, phomList);
    }

    value() {
        return this.phoms.reduce((retV, phom) => retV + phom.value(), this.length * 1000);
    }

    remove(phom) {
        return ArrayUtils.remove(this.phoms, phom);
    }
    
    forEach(cb) {
        this.phoms.forEach(cb);
    }
    
    map(cb) {
        return this.phoms.map(cb);
    }
    
    filter(cb) {
        return this.phoms.filter(cb);
    }
    
    sort(cb) {
       return this.phoms.sort(cb); 
    }
    
    some(cb) {
        return this.phoms.some(cb);
    }
    
    splice(start, count) {
        this.phoms.splice(start, count);
    }
    
    indexOf(item) {
        return this.phoms.indexOf(item);
    }
}

// export default class PhomList extends Array {
//     constructor(phoms) {
//         super();
//         this.owner = 0;
//         this.renderComponent = null;
//         this.cards = [];
        
//         if (!ArrayUtils.isEmpty(phoms)) {
//             this.push(...phoms);
//         }
//     }
    
//     isEmpty(){
//         return this.cards.length == 0;
//     }

//     getPhomLengths() {
//         return this.map(phom => phom.cards.length);
//     }

//     join(phomList) {
//         phomList && this.push(...phomList);
//     }

//     push(...phoms) {
//         super.push(...phoms);
//         phoms.forEach(phom => phom.cards && this.cards.push(...phom.cards));
//     }

//     /**
//      * this.length < 3 mean that only model created
//      *
//      * @param phom
//      */
//     add(phomModel) {
//         this.push(phomModel);
//     }

//     getCards() {
//         return this.cards;
//     }

//     clear() {
//         window.release(this.cards);
//         this.forEach(phom => phom.clear());
//     }

//     toBytes() {
//         return this.cards.map(card => {
//             return card.byteValue;
//         });
//     }

//     equals(phomList) {
//         if (this.length != phomList.length) return false;
//         return ArrayUtils.containsAll(this, phomList);
//     }

//     value() {
//         return this.reduce((retV, phom) => retV + phom.value(), this.length * 1000);
//     }

//     remove(phom) {
//         return ArrayUtils.remove(this, phom);
//     }
// }
PhomList.MAX_PHOM_COUNT = 3;