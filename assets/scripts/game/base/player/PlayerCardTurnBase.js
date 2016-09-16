/**
 * Created by Thanh on 8/23/2016.
 */

import PlayerCard from 'PlayerCard'
import PlayerTurnBaseAdapter from 'PlayerTurnBaseAdapter'

export default class PlayerCardTurnBase extends PlayerCard {
    constructor(board, user) {
        super(board, user);
        this.turnAdapter = new PlayerTurnBaseAdapter(board);
    }

    onLoad(){
        super.onLoad();
        this.turnAdapter.setBoard(this.board);
        this.turnAdapter.setPlayer(this);
    }
}