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

        this.resultIconNode = {
            default: null,
            type: cc.Node
        };
        this.resultIcon = {
            default: null,
            type: cc.Sprite
        };
        this.playerName = {
            default: null,
            type: cc.Label
        };
        this.dataContainer = {
            default: null,
            type: cc.Node
        };

        this.balanceLabel = {
            default: null,
            type: cc.Label
        }

        this.resultText = {
            default: null,
            type: cc.Label
        }

        this.infoTextViewNode = {
            default: null,
            type: cc.Node
        }

        this.cardListPrefab = {
            default: null,
            type: cc.Prefab
        }

        /**
         *
         * @type {TextView}
         */
        this.infoTextView = null;

        /**
         * @type {CardList}
         */
        this.cardList = null;
        this.info = "";
        this.model = null;
    }

    onEnable(){
        super.onEnable();
        this.resultIcon = this.resultIconNode.getComponent(cc.Sprite);
        this.infoTextView = this.infoTextViewNode.getComponent('TextView');
        this.model && this._renderData(this.model);
    }

    _setResultIcon(url){
        cc.loader.loadRes(url, cc.SpriteFrame, (err, spriteFrame) => {
            this.resultIcon.spriteFrame = spriteFrame;
        });
    }

    setModel(model){
        this.model = model;
    }

    _renderData({name = "", text = null, iconPath = "", balanceChanged = NaN, info = "", cards = []} = {}){

        this.infoTextView && this.infoTextView.setText(info);

        this.playerName.string = name;
        this.balanceLabel.string = Number.isNaN(balanceChanged) ? "" : balanceChanged > 0 ? `+${balanceChanged}` : `${balanceChanged}`;

        if(utils.isEmpty(iconPath)){
            text && this.resultText && (this.resultText.string = text);
            utils.active(this.resultText);
            utils.deactive(this.resultIcon);
        }else{
            utils.active(this.resultIcon);
            utils.deactive(this.resultText);
            this._setResultIcon(iconPath);
        }

        let cardListNode = cc.instantiate(this.cardListPrefab);
        this.dataContainer.addChild(cardListNode);
        this.cardList = cardListNode.getComponent('CardList');

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