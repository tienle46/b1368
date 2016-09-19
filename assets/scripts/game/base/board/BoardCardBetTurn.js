/**
 * Created by Thanh on 8/23/2016.
 */

import BoardBetTurnAdapter from 'BoardBetTurnAdapter';
import BoardCard from 'BoardCard';

export default class BoardCardBetTurn extends BoardCard {
    constructor(room, scene) {
        super(room, scene);
        this.betAdapter = new BoardBetTurnAdapter();
    }

    onLoad(){
        super.onLoad();
        this.betAdapter.setBoard(this);
    }
}