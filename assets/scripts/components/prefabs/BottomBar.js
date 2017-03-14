import app from 'app';
import Actor from 'Actor';
import TimerRub from 'TimerRub';
import DialogRub from 'DialogRub';

class BottomBar extends Actor {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            highLightNode: cc.Node,
            titleContainerNode: cc.Node,
            supportPhoneNumberLbl: cc.Label
        }

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

    onClickEventAction() {
        let dialog = new DialogRub(this.node.parent, null, { title: 'Sự kiện' });
        dialog.addBody('dashboard/dialog/prefabs/event/EventDialog', 'EventDialog');
    }


    onClickTopRankAction() {
        let url = `${app.const.DIALOG_DIR_PREFAB}/rank`;
        let tabs = [{
            title: 'Top VIP',
            value: `${url}/tab_top_vip`
        }, {
            title: 'Top Cao thủ',
            value: `${url}/tab_top_cao_thu`
        }, {
            title: 'Top Đại gia',
            value: `${url}/tab_top_dai_gia`
        }];

        DialogRub.show(app.system.getCurrentSceneNode(), tabs, { title: 'Xếp hạng' });
    }

    // on high light message listener
    _onHLMListener() {
        if (!this.intervalTimer) {
            this.intervalTimer = new TimerRub(this._onRunningHLM.bind(this), this.interval);
        }
    }

    _onRunningHLM() {
        let hlm = app.system.hlm.getMessage();

        /**
         * hlm -> pause interval -> display message -> resume -> hlm
         */
        if (hlm && this.highLightNode && this.intervalTimer) {
            // pause timer
            this.intervalTimer.pause();

            // show hight light
            let txt = this.highLightNode.getComponent(cc.RichText) || this.highLightNode.getComponent(cc.label);
            // update text
            txt.string = hlm.msg;

            let txtWidth = this.highLightNode.getContentSize().width;
            let montorWidth = cc.director.getWinSize().width;
            let nodePositionY = this.highLightNode.getPosition().y;

            let movingTime = (txtWidth + montorWidth / 2) / 85;
            let startPosition = cc.v2(this.highLightNode.getPosition());
            let endPosition = cc.v2(0 - txtWidth - montorWidth / 2, nodePositionY);


            let action = cc.moveTo(movingTime, endPosition);
            let repeatCount = hlm.rc;

            let rp = cc.repeat(cc.sequence(action, cc.callFunc(() => {
                this.highLightNode.setPosition(startPosition);
                repeatCount--;
                // if complete counting, resume timer interval
                repeatCount === 0 && this.intervalTimer.resume();
            })), Number(hlm.rc));

            this.highLightNode.runAction(rp);
        }
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