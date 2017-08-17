/**
 * Created by Thanh on 10/4/2016.
 */

import app from 'app';
import utils from 'PackageUtils';
import { Actor } from 'components';
import GameUtils from 'GameUtils';

export default class GameResultItem extends Actor {
    constructor() {
        super();

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
        };

        this.resultWinnerText = {
            default: null,
            type: cc.Label
        };

        this.resultLoserText = {
            default: null,
            type: cc.Label
        };

        this.infoTextViewNode = {
            default: null,
            type: cc.Node
        };

        this.cardListPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.winnerBoxNode = {
            default: null,
            type: cc.Node
        };

        /**
         *
         * @type {TextView}
         */
        this.infoTextView = null;

        /**
         * @type {CardList}
         */
        this.cardListNode = {
            default: null,
            type: cc.Node
        };

        this.info = "";
        this.model = null;
    }

    onEnable() {
        super.onEnable();
        this.infoTextView = this.infoTextViewNode.getComponent('TextView');
        this.model && this._renderData(this.model);
    }

    // _setResultIcon(url) {
    //     cc.loader.loadRes(url, cc.SpriteFrame, (err, spriteFrame) => {
    //         this.resultIcon.spriteFrame = spriteFrame;
    //     });
    // }

    setModel(model) {
        this.model = model;
    }

    _renderData({ name = "", text = null, iconPath = "", balanceChanged = NaN, info = "", cards = [], isWinner = false } = {}) {


        this.infoTextView && this.infoTextView.setText(info);

        this.playerName.string = name;
        this.balanceLabel.string = GameUtils.toChangedBalanceString(balanceChanged);

        if (isWinner) {
            cards.length == 0 && this.showWinnerBox();
            this.balanceLabel.node.color = app.const.COLOR_YELLOW;
            text && this.resultWinnerText && (this.resultWinnerText.string = text.toUpperCase());
            utils.active(this.resultWinnerText);
            utils.deactive(this.resultLoserText);
        } else {
            this.balanceLabel.node.color = app.const.COLOR_GRAY;
            text && this.resultLoserText && (this.resultLoserText.string = text.toUpperCase());
            utils.active(this.resultLoserText);
            utils.deactive(this.resultWinnerText);
        }

        // if (utils.isEmpty(iconPath)) {
        //     text && this.resultText && (this.resultText.string = text);
        //     utils.active(this.resultText);
        // } else {
        //     utils.deactive(this.resultText);
        //     // this._setResultIcon(iconPath);
        // }

        // let cardListNode = cc.instantiate(this.cardListPrefab);
        // this.dataContainer.addChild(cardListNode);
        // this.cardList = cardListNode.getComponent('CardList');
        this.cardList = this.cardListNode.getComponent('CardList');

        // this.cardList.setProperties({
        //     x: 0,
        //     y: 0,
        //     scale: 0.6,
        //     alignment: CardList.ALIGN_CENTER_LEFT,
        //     maxDimension: this.dataContainer.width,
        // });

        this.cardList.setCards(cards);
    }

    showWinnerBox() {
        this.winnerBoxNode.opacity = 255;
        // hide info bg
        this.infoTextViewNode.opacity = 0;
    }
}

app.createComponent(GameResultItem);