/**
 * Created by Thanh on 8/23/2016.
 */

import Player from 'Player';

export default class PlayerCard extends Player {
    constructor(board, user) {
        super(board, user);

        this.cards = [];
    }

    setCards(cards){
        console.log("Set card to player");
        this.cards = cards;
        this.renderer.renderCards(cards);
    }

    createFakeCards(size){

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