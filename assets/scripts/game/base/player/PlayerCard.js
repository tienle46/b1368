/**
 * Created by Thanh on 8/23/2016.
 */

import {GameUtils} from 'utils';
import Player from 'Player';

export default class PlayerCard extends Player {
    constructor(board, user) {
        super(board, user);

        this.cards = [];
        this.remainCardCount = 0;
    }

    setCards(cards){
        log("Set card to player");
        this.cards = cards;
        this.renderer.renderCards(cards);
    }

    _init(board, user){
        super._init(board, user);
    }

    createFakeCards(size){
        let cardBytes = new Array(size).fill(5);
        this.setCards(GameUtils.convertBytesToCards(cardBytes));
    }

    onLoad(){
        super.onLoad();
    }

    onGameBegin(data){
        super.onGameBegin(data)

        this.renderer.cardList.clear();
    }

    findCards(cardModels){
        return this.renderer.findCards(cardModels);
    }

    onGameEnding(data = {}){
        super.onGameEnding(data);
        this.renderer.clearCards();
    }

}