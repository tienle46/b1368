/**
 * Created by Thanh on 9/15/2016.
 */

import utils from 'utils';
import app from 'app';
import CardList from 'CardList';
import PlayerCardBetTurnRenderer from 'PlayerCardBetTurnRenderer';

export default class PlayerBaCayRenderer extends PlayerCardBetTurnRenderer {
    constructor() {
        super();
    }

    showBetAmount(amount){
        //TODO
    }

    showAddBetToMasterAnimation(amount){
        //TODO
    }

    revealAllCards(){
        this.cardList.cards.forEach(card => card.setReveal(true));
    }

    _getHandCardAlign(){
        let positionOnRight = this.scene.gamePlayers.playerPositions.isPositionOnRight(this.anchorIndex);
        return positionOnRight ? CardList.ALIGN_BOTTOM_RIGHT : CardList.ALIGN_BOTTOM_LEFT;
    }

    /**
     * @param cardList
     * @param isItMe
     * @override
     */
    _getCardAnchorPoint(player) {
        let positionOnRight = this.scene.gamePlayers.playerPositions.isPositionOnRight(player.anchorIndex);
        return positionOnRight ? this.defaultCardAnchor2 : this.defaultCardAnchor;
    }

    /**
     * @param cardList
     * @param isItMe
     * @override
     */
    _initHandCardList(cardList, isItMe){
        super._initHandCardList(cardList, isItMe);
        if (isItMe) {
            cardList.setSpace(70);
            cardList.setMaxDimension(350);
            cardList.setDraggable(false);
            cardList.setSelectable(false);
            cardList.setRevealOnClick(true);
            cardList.setReveal(false);
            cardList.setAlign(CardList.ALIGN_BOTTOM_LEFT);
        } else {
            cardList.setSpace(60);
            cardList.setMaxDimension(350);
            cardList.setAlign(this._getHandCardAlign());
        }
    }
}

app.createComponent(PlayerBaCayRenderer);
