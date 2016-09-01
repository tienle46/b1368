/**
 * Created by Thanh on 8/23/2016.
 */

import PlayerCard from 'PlayerCard'

export default class PlayerCardTurnBase extends PlayerCard {
    constructor() {
        super();
        this.turnAdapter = null;
    }
}