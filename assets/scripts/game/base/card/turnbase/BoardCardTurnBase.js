/**
 * Created by Thanh on 8/23/2016.
 */

import BoardTurnBaseAdapter from 'BoardTurnBaseAdapter'
import BoardCard from 'BoardCard'

export default class BoardCardTurnBase extends BoardCard {
    constructor(room) {
        super(room);
        this.turnAdapter = null;
    }
}