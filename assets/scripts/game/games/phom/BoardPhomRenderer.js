/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import CCUtils from 'CCUtils';
import GameUtils from 'GameUtils';
import Events from 'Events';
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

    fillDeckFakeCards(){
        this.deckCardRenderer.setCards(GameUtils.convertBytesToCards(Array(16).fill(0)));
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