/**
 * Created by Thanh on 11/4/2016.
 */

import app from 'app';
import CardList from 'CardList';

export default class Phom extends CardList {
    constructor(cards = []) {
        super();

        this.cards = cards;
        //Auto sort  phom.sortAsc(GamePlayType.GAME_TYPE_PHOM);
        this.owner = 0;
    }

    setOwner(owner){
        this.owner = owner;
    }

    static from(cards){
        let phom = new Phom();
        phom.cards = cards;
        return phom;
    }
}

app.createComponent(Phom);