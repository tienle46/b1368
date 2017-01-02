import app from 'app';
import Component from 'Component';
import TimerRub from 'TimerRub';
import PromptPopupRub from 'PromptPopupRub';
import DialogRub from 'DialogRub';


class TopBar extends Component {
    constructor() {
        super();

        this.highLightNode = {
            default: null,
            type: cc.Node
        };

        this.moreButton = {
            default: null,
            type: cc.Button
        };

        this.eventButton = {
            default: null,
            type: cc.Button
        };

        this.backButton = {
            default: null,
            type: cc.Button
        };

        this.chatBtn = {
            default: null,
            type: cc.Button
        };

        this.soundControl = {
            default: null,
            type: cc.Node
        };

        this.titleContainerNode = {
            default: null,
            type: cc.Node
        };

        this.dropDownOptions = {
            default: null,
            type: cc.Node
        };

        this._showBack = false;
        this.intervalTimer = null;
        this.interval = 2000; // display high light message after 2s, if any
    }

    onLoad() {
        if (this._showBack) {
            this.moreButton.node.active = false;
            this.eventButton.node.active = false;
            this.titleContainerNode.active = false;
        } else {
            this.backButton.node.active = false;
            this.chatBtn.node.active = false;
        }

        this.dropDownOptions.getChildByName('bg').on(cc.Node.EventType.TOUCH_END, () => {
            this.dropDownOptions.active = false;
        });
    }

    giveFeedbackClicked() {
        this.prom = new PromptPopupRub(app.system.getCurrentSceneNode(), { confirmBtn: this._onFeedbackConfirmed }, { label: { text: 'Enter text here:' } }, this);
        this.prom.init();
    }

    onEnable() {
        this._addGlobalListeners();
    }

    onDestroy() {
        super.onDestroy();
        this._removeGlobalListeners();
        if (this.intervalTimer) {
            this.intervalTimer.clear();
            this.intervalTimer = null;
        }
    }

    showBackButton() {
        this._showBack = true;
    }

    onClickLogout() {
        app.system.confirm(
            app.res.string('really_wanna_quit'),
            null,
            this._onConfirmLogoutClick.bind(this)
        );
    }

    onFanpageClicked() {
        cc.sys.openURL(`https://www.messenger.com/t/${app.config.fbAppId}`);
    }

    onSoundBtnClick() {
        this.soundControl && this.soundControl.getComponent('SoundControl').show();
    }

    handleSettingAction(e) {
        // let options = {
        //     arrow: {
        //         align: {
        //             left: 25
        //         }
        //     }
        // };

        // let dropdown = new VerticalDropDownRub(e.currentTarget, [{
        //     icon: 'bottombar/bottombar_tooltip_fanpage',
        //     content: 'Fanpage',
        //     event: this.fanpageClicked.bind(this)
        // }, {
        //     icon: 'bottombar/bottombar_tooltip_sound',
        //     content: 'Âm lượng',
        //     event: this.onSoundBtnClick.bind(this)
        // }, {
        //     icon: 'game/images/ingame_exit_icon',
        //     content: 'Thoát',
        //     event: this.onClickLogout.bind(this),
        // }], options);
        // this.node.addChild(dropdown.node());

    }

    onClickEventAction() {
        let dialog = new DialogRub(this.node.parent, null, { title: 'Sự kiện' });
        dialog.addBody('dashboard/dialog/prefabs/event/event_dialog');
    }


    onChatBtnClick() {
        console.log('onChatClick');
    }

    handleMoreAction() {
        let state = this.dropDownOptions.active;
        this.dropDownOptions.active = !state;
    }

    handleBackAction() {
        // this._listenBackAction && this._listenBackAction();
        app.system.loadScene(app.const.scene.DASHBOARD_SCENE);
    }


    /**
     * PRIVATES 
     */

    _onConfirmLogoutClick() {
        app.service.manuallyDisconnect();
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

    _addGlobalListeners() {
        this.titleContainerNode.active && app.system.addListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHLMListener, this);
    }

    _removeGlobalListeners() {
        this.titleContainerNode.active && app.system.removeListener(app.commands.HIGH_LIGHT_MESSAGE, this._onHLMListener, this);
    }

    _onFeedbackConfirmed() {
        //collect user feedback and send to server
        let content = this.prom.getVal();
        if (content && content.trim().length > 0) {
            var sendObject = {
                'cmd': app.commands.SEND_FEEDBACK,
                'data': {
                    [app.keywords.REQUEST_FEEDBACK]: content
                }
            };

            app.service.send(sendObject, (data) => {
                if (data && data["s"]) {
                    app.system.showToast('Cảm ơn bạn, feedback của bạn đã được gửi tới ban quản trị');
                } else {
                    app.system.showToast('Gửi góp ý thất bại, xin vui lòng thử lại');
                }

            }, app.const.scene.DASHBOARD_SCENE);
        }
    }
}

app.createComponent(TopBar);