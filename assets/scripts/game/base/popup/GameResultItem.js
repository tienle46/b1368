/**
 * Created by Thanh on 10/4/2016.
 */

import app from 'app';
import utils from 'utils';
import {Actor} from 'components';
import {CardList} from 'game-components';

export default class GameResultItem extends Actor {
    constructor() {
        super();

        this.resultIconNode = cc.Node;
        this.resultIcon = cc.Sprite;
        this.playerName = cc.Label;
        this.dataContainer = cc.Node;
        this.balanceLabel = cc.Label;
        this.infoLabel = cc.Label;
        
        this.cardList = null;
        this.cardListPrefab = cc.Prefab;
    }

    onLoad(){
        this.resultIcon = this.resultIconNode.getComponent(cc.Sprite);
    }

    setResultIcon(url){
        !utils.isEmpty(url) && cc.loader.loadRes(url, cc.SpriteFrame, (err, spriteFrame) => {
            this.resultIcon.spriteFrame = spriteFrame;
        });
    }

    setModel({playerName = "", iconPath = "", balanceChanged = 0, info = "", cards = []} = {}){
        this.infoLabel.string = info;
        this.playerName.string = playerName;
        this.balanceLabel.string = balanceChanged > 0 ? `+${balanceChanged}` : `${balanceChanged}`;
        this.setResultIcon(iconPath);

        let cardListNode = cc.instantiate(this.cardListPrefab);
        this.cardList = cardListNode.getComponent(CardList.name);

        this.cardList.setAnchorPoint(0, 0.5);
        this.cardList.setScale(0.6);
        this.cardList.setMaxDimension(450);
        this.cardList.setCards(cards);
        this.dataContainer.addChild(this.cardList.node);
    }
}

app.createComponent(GameResultItem);