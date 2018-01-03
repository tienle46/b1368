import app from 'app';
import Actor from 'Actor';
import HighLowCardHand from './HighLowCardHand'
// import MessagePopup from 'MessagePopup';
import Utils from 'GeneralUtils';

class HighLowHistoryItemInfoItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            lblTime: cc.Label,
            lblStep: cc.Label,
            lblAction: cc.Label,
            lblWin: cc.Label,
            cardHand: cc.Sprite,
            cardAtlas: cc.SpriteAtlas,
        });
        this.popupInfo = null;
        this.time = ''
    }

    loadData(data) {
        // let time = this.formatTime(data.time);
        let step = data.step
        let predict = ''
        if(data.predict != undefined) {
            predict = data.predict ? 'trên' : 'dưới'
        }
        let win = data.winAmount || 0;
        let card = data.card
        
        this.lblTime.string = this.time
        this.lblStep.string = step
        this.lblAction.string = predict
        this.lblWin.string = win
        // this.info = info

        this.cardHand.spriteFrame = this.cardAtlas.getSpriteFrame(HighLowCardHand.getSpriteName(card))
    }

    formatTime(dateStr) {
        return Utils.timeFormat(dateStr, 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm');
    }
    
}

app.createComponent(HighLowHistoryItemInfoItem);