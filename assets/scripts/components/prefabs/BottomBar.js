import app from 'app';
import Actor from 'Actor';
import TimerRub from 'TimerRub';
import Linking from 'Linking';

class BottomBar extends Actor { // bottombar <- STUFF (visibility via manager) -> actor
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            highLightNode: cc.Node,
            titleContainerNode: cc.Node,
            supportPhoneNumberLbl: cc.Label,
            hotlineBtn: cc.Button,
            eventBtnNode: cc.Node,
            agencyBtnNode: cc.Node
        });
       
        this.intervalTimer = null;
        this.interval = 2000; // display high light message after 2s, if any
    }

    onLoad() {
        super.onLoad();
    }

    onEnable() {
        super.onEnable();
        this.supportPhoneNumberLbl.string = app.res.string('hotline', { hotline: app.config.supportHotline })
    }

    onDestroy() {
        super.onDestroy();
        if (this.intervalTimer) {
            this.intervalTimer.clear();
            this.intervalTimer = null;
        }
    }
    
    onHotLineBtnClick() {
        cc.sys.openURL(`tel:${app.config.supportHotline}`);    
    }
    
    onClickEventAction() {
        app.visibilityManager.goTo(Linking.ACTION_EVENT);
    }

    onClickAgencyAction() {
        app.visibilityManager.goTo(Linking.ACTION_AGENCY);
    }

    // on high light message listener
    _onHLMListener() {
        if (!this.intervalTimer) {
            this.intervalTimer = new TimerRub(this._onRunningHLM.bind(this), this.interval);
        }
    }

    _onRunningHLM() {
        app.system.hlm.runMessage(this.intervalTimer, this.highLightNode);
    }

    _addGlobalListener() {
        super._addGlobalListener();
        app.system.addListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHLMListener, this);
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
        app.system.removeListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHLMListener, this);
    }
}

app.createComponent(BottomBar);