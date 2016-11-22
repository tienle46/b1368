/**
 * Created by Thanh on 11/4/2016.
 */

import ArrayUtils from "ArrayUtils";
import PhomUtils from "./PhomUtils";

export default class PhomList extends Array {
    constructor(phoms) {
        super();

        this.owner = 0;
        this.renderComponent = null;
        this.cards = [];

        if(!ArrayUtils.isEmpty(phoms)){
            this.push(...phoms);
        }
    }

    getPhomLengths() {
        return this.map(phom => phom.cards.length);
    }

    join(phomList) {
        phomList && this.push(...phomList);
    }

    push(...phoms) {
        super.push(...phoms);
        phoms.forEach(phom => this.cards.push(...phom.cards));
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
        this.cards.splice(0, this.cards.length);
        this.forEach(phom => phom.clear());
    }

    toBytes() {
        return this.cards.map(card => {
            return card.byteValue
        });
    }

    equals(phomList) {
        if (this.length != phomList.length) return false;
        return ArrayUtils.containsAll(this, phomList);
    }

    value() {
        return this.reduce((retV, phom) => retV + phom.value(), this.length * 1000);
    }

    remove(phom) {
        return ArrayUtils.remove(this, phom);
    }
}

PhomList.MAX_PHOM_COUNT = 3;