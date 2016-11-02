/**
 * Created by Thanh on 8/23/2016.
 */

import PlayerCard from 'PlayerCard';
import PlayerBetTurnAdapter from 'PlayerBetTurnAdapter';

export default class PlayerCardBetTurn extends PlayerCard {
    constructor(board, user) {
        super(board, user);
        this.betAdapter = new PlayerBetTurnAdapter(board);
    }

    onLoad(){
        super.onLoad();

        this.betAdapter._init(this.board, this);
    }

}