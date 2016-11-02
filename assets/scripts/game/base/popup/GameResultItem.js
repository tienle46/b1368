/**
 * Created by Thanh on 10/4/2016.
 */

import app from 'app';
import utils from 'utils';
import {Actor} from 'components';
import {CardList} from 'game-components';
import TextView from 'TextView';

export default class GameResultItem extends Actor {
    constructor() {
        super();

        this.resultIconNode = cc.Node;
        this.resultIcon = cc.Sprite;
        this.playerName = cc.Label;
        this.dataContainer = cc.Node;
        this.balanceLabel = cc.Label;
        this.infoTextViewNode = cc.Node;
        this.infoTextView = TextView;

        this.cardList = null;
        this.cardListPrefab = cc.Prefab;
        this.info = "";
    }

    onLoad(){
        super.onLoad();
        this.resultIcon = this.resultIconNode.getComponent(cc.Sprite);
        this.infoTextView = this.infoTextViewNode.getComponent(TextView.name);
        this.infoTextView.setText(this.info);
    }

    setResultIcon(url){
        !utils.isEmpty(url) && cc.loader.loadRes(url, cc.SpriteFrame, (err, spriteFrame) => {
            this.resultIcon.spriteFrame = spriteFrame;
        });
    }

    setModel({name = "", iconPath = "", balanceChanged = NaN, info = "", cards = []} = {}){

        if(this.infoTextView.setText){
            this.infoTextView.setText(info);
        }else{
           this.info = info;
        }

        this.playerName.string = name;
        this.balanceLabel.string = Number.isNaN(balanceChanged) ? "" : balanceChanged > 0 ? `+${balanceChanged}` : `${balanceChanged}`;
        this.setResultIcon(iconPath);

        let cardListNode = cc.instantiate(this.cardListPrefab);
        this.dataContainer.addChild(cardListNode);
        this.cardList = cardListNode.getComponent(CardList.name);

        this.cardList.setProperties({
            x: 0,
            y: 0,
            scale: 0.6,
            alignment: CardList.ALIGN_CENTER_LEFT,
            maxDimension: this.dataContainer.width,
        });
        this.cardList.setCards(cards);
    }
}

app.createComponent(GameResultItem);