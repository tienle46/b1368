import app from 'app';
import Component from 'Component';
import VerticalDropDownRub from 'VerticalDropDownRub';

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

        this.highLightLabel = {
            default: null,
            type: cc.Label
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
    }

    onLoad() {
        if (this._showBack) {
            this.settingButton.node.removeFromParent();
        } else {
            this.backButton.node.removeFromParent();
        }
    }

    showBackButton() {
        this._showBack = true;
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
            icon: null,
            content: null
        }, {
            icon: null,
            content: null
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