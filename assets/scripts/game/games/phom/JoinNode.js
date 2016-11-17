/**
 * Created by Thanh on 11/11/2016.
 */

export default class JoinNode {

    constructor(card, phomId = -1) {
        this.phomId = phomId;
        this.card = card;
    }

    value() {
        return this.phomId << 8 + this.card.value();
    }
}
