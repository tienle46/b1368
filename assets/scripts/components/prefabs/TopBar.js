import app from 'app';
import Component from 'Component';
import VerticalDropDownRub from 'VerticalDropDownRub';
import ConfirmPopupRub from 'ConfirmPopupRub';
import TimerRub from 'TimerRub';

class TopBar extends Component {
    constructor() {
        super();

        this.settingButton = {
            default: null,
            type: cc.Button
        };

        this.chatButton = {
            default: null,
            type: cc.Button
        };

        this.highLightNode = {
            default: null,
            type: cc.Node
        };

        this.friendsButton = {
            default: null,
            type: cc.Button
        };

        this.moreButton = {
            default: null,
            type: cc.Button
        };

        this.backButton = {
            default: null,
            type: cc.Button
        };

        this._showBack = false;
        this.time = 2000; // display high light message after 2s, if any
    }

    onLoad() {
        if (this._showBack) {
            this.settingButton.node.removeFromParent();
        } else {
            this.backButton.node.removeFromParent();
        }

        this.chatButton.node.runAction(cc.hide());
    }

    _onTest() {
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


    // on high light message listener
    _onHLMListener() {
        if (!this.intervalTimer) {
            this.intervalTimer = new TimerRub(this._onTest.bind(this), this.time);
        }
    }

    _addGlobalListeners() {
        app.system.addListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHLMListener, this);
    }

    _removeGlobalListeners() {
        app.system.removeListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHLMListener);
    }

    onEnable() {
        this._addGlobalListeners();
    }

    onDestroy() {
        this._removeGlobalListeners();
    }

    showBackButton() {
        this._showBack = true;
    }

    onClickLogout() {
        let parentNode = cc.director.getScene();

        ConfirmPopupRub.show(parentNode, `Bạn có chắc chắn muốn thoát`, this._onConfirmLogoutClick, null, this);
    }

    _onConfirmLogoutClick() {
        log(`about to logout`);

        app.service.manuallyDisconnect();
    }

    handleSettingAction(e) {
        let options = {
            arrow: {
                align: {
                    left: 25
                }
            }
        };

        let dropdown = new VerticalDropDownRub(e.currentTarget, [{
            icon: 'bottombar/bottombar_tooltip_fanpage',
            content: 'Fanpage'
        }, {
            icon: 'bottombar/bottombar_tooltip_sound',
            content: 'Âm lượng'
        }, {
            icon: 'game/images/ingame_exit_icon',
            content: 'Thoát',
            event: this.onClickLogout.bind(this),
        }], options);
        this.node.addChild(dropdown.node());

    }

    handleChatAction() {

    }

    handleFriendButtonAction() {

    }

    handleMoreAction() {

    }

    handleBackAction() {
        // this._listenBackAction && this._listenBackAction();
        app.system.loadScene('DashboardScene');
    }
}

app.createComponent(TopBar);