/**
 * Created by Thanh on 8/23/2016.
 */

import PlayerCard from 'PlayerCard';
import PlayerTurnBaseAdapter from 'PlayerTurnBaseAdapter';

export default class PlayerCardTurnBase extends PlayerCard {
    constructor(board, user) {
        super(board, user);
    }

    _init(board, user){
        super._init(board, user);

        this.turnAdapter = new PlayerTurnBaseAdapter();
        this.turnAdapter._init(board.scene, this);
    }


    onLoad(){
        super.onLoad();
    }

    onGamePlaying(){
        if (this.isItMe()) {
            this._onWaitTurn()
        }
    }

    _onWaitTurn(){

    }

    

}