/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import GameUtils from 'GameUtils';
import BoardCardTurnBaseRenderer from 'BoardCardTurnBaseRenderer';

export default class BoardPhomRenderer extends BoardCardTurnBaseRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            tapHighlightNode: cc.Node
        }
    }

    _initCenterDeckCard() {
        super._initCenterDeckCard()
    }

    fillDeckFakeCards(fakeCount){
        if (fakeCount <= 0) return;

        this.deckCardRenderer.setOnCardClickListener(() => this.data.actor.onClickDeckCard())
        this.deckCardRenderer.setCards(GameUtils.convertBytesToCards(Array(fakeCount).fill(0)));
        this.deckCardRenderer.cards.forEach(card => {
            card.setOnClickListener(() => this.data.actor.onClickDeckCard())
            card.setEnableScaleOnClick(true)
        })
    }

    onLoad(){
        super.onLoad();
    }

    onEnable(){
        super.onEnable();
        this._initCenterDeckCard();
        
        this.tapHighlightNode.removeFromParent();
        let currentSceneNode = app.system.getCurrentSceneNode();
        currentSceneNode && currentSceneNode.addChild(this.tapHighlightNode)
    }
}

app.createComponent(BoardPhomRenderer);