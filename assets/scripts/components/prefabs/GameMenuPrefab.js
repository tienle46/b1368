import app from 'app';
import Component from 'Component';
import SFS2X from 'SFS2X';
import Events from 'Events';
import utils from 'utils';
import TopupDialogRub from 'TopupDialogRub';
import Keywords from 'Keywords';
import Commands from 'Commands';
import ScrollMessagePopup from 'ScrollMessagePopup';

const ACTION_LUAT_CHOI = 1;

class GameMenuPrefab extends Component {
    constructor() {
        super();

        this.menuBtn = {
            default: null,
            type: cc.Node
        };

        this.chatBtn = {
            default: null,
            type: cc.Node
        };

        this.topupBtn = {
            default: null,
            type: cc.Node
        };

        this.menuPopup = cc.Node;
        this.exitButton = cc.Button;
        this.guideButton = cc.Button;
        this.exitLabel = cc.Label;
        this.guideLabel = cc.Label;

        this.scene = null;
        this.isMenuPopupShown = false;
    }

    onLoad(){
        utils.deactive(this.menuPopup);
    }

    _init(scene) {
        this.scene = scene;
    }

    _onClickMenuItem(eventName, ...args){
        this.hide();
        this.scene.emit(eventName, ...args);
    }

    onClickExitButton(event)
    {
        this.hide();
        this._onClickMenuItem(Events.ON_ACTION_EXIT_GAME);
    }

    onClickGuideButton(){
        this.hide();

        let data = {
            [Keywords.SERVICE_ID] : this.scene.gameCode,
            [Keywords.CLIENT_VERSION] : 1,
            [Keywords.ACTION] : ACTION_LUAT_CHOI,
            "testMode": false
        }

        ScrollMessagePopup.show(this.scene.node, {cmd: Commands.RULE_OF_GAME, data: data, parser: (data) => {
            return data[Keywords.GAME_RULE] ? data[Keywords.GAME_RULE] : data[Keywords.GAME_GUIDE];
        }});

    }

    onClickMenuButton(event) {
        this.isMenuPopupShown ? this.hide() : this.show();
    }

    onClickOutsideMenuPopup() {
        this.hide();
    }

    _onTouchGameMenu(){
        this.isMenuPopupShown && this.hide();
    }

    onDisable(){
        this.menuPopup.off('touchstart', this._onTouchGameMenu, this);
    }

    show(){
        utils.active(this.menuPopup);
        this.isMenuPopupShown = true;
        this.menuPopup.on('touchstart', this._onTouchGameMenu, this);
    }

    hide(){
        utils.deactive(this.menuPopup);
        this.isMenuPopupShown = false;
        this.menuPopup.off('touchstart', this._onTouchGameMenu, this);
    }

    onClickChatButton(event) {
        this.hide();
        app.system.info(app.res.string('coming_soon'));
    }

    onClickTopupButton(event) {
        this.hide();
        TopupDialogRub.show(this.scene.node);
    }
}

app.createComponent(GameMenuPrefab);