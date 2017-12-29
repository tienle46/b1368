import app from 'app';
import Actor from 'Actor';
import HighLowCardHand from './HighLowCardHand'
// import MessagePopup from 'MessagePopup';
import HighLowHistoryItemInfoPopup from 'HighLowHistoryItemInfoPopup';
import Utils from 'GeneralUtils';

class HighLowHistoryItem extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            lblSession: cc.Label,
            lblStepNumber: cc.Label,
            lblBet: cc.Label,
            lblWin: cc.Label,
            // cardHand: cc.Sprite,
            // cardAtlas: cc.SpriteAtlas,
            popupHistoryItemInfoPrefab: cc.Prefab,
        });
        this.popupInfo = null;
        // this.info = 'null';
    }

    loadData(data) {
        // let time = this.formatTime(data.time);
        let session = data.i
        let stepNumber = data.step
        let bet = data.bet || 0;
        let win = data.winAmount || 0;
        // let card = data.card
        // let info = data.info
        
        // this.lblTime.string = time
        this.lblSession.string = session
        this.lblStepNumber.string = stepNumber
        this.lblBet.string = bet
        this.lblWin.string = win
        // this.info = info
        // this.info = info

        // this.cardHand.spriteFrame = this.cardAtlas.getSpriteFrame(HighLowCardHand.getSpriteName(card))
    }

    formatTime(dateStr) {
        return Utils.timeFormat(dateStr, 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YY HH:mm');
    }
    
    _initPopupInfo() {
        if (!this.popupHistoryItemInfoPrefab) return;
        if (!this.popupInfo) {
            this.popupInfo = cc.instantiate(this.popupHistoryItemInfoPrefab);
            this.popupInfo.active = false;
            this.popupInfo.position = cc.p(0,0);
            this.addNode(this.popupInfo);
            app.system.getCurrentSceneNode().addChild(this.popupInfo, 30);
        }
    }
    
    onBtnInfoClicked() {
        this._initPopupInfo();
        if (!this.popupInfo) return;

        // var popupInfoController = this.popupTop.getComponent(HighLowTopPopup);
        var popupInfoController = this.popupInfo.getComponent(HighLowHistoryItemInfoPopup);
        if(popupInfoController){
            popupInfoController.openPopup(true);
            // popupInfoController.onReceivedData(this.info)
        }
    }

}

app.createComponent(HighLowHistoryItem);