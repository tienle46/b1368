import app from 'app';
import Component from 'Component';
import SFS2X from 'SFS2X';
import Events from 'Events';
import utils from 'utils';

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

    onClickExitButton(event)
    {
        this.scene.emit(Events.ON_ACTION_EXIT_GAME);
    }

    onClickGuideButton()
    {
        this.scene.emit(Events.ON_ACTION_LOAD_GAME_GUIDE);
    }

    onClickMenuButton(event) {
        this.isMenuPopupShown ? this.hideMenuPopup() : this.showMenuPopup();
    }

    onClickOutsideMenuPopup() {
        this.hideMenuPopup();
    }

    _onTouchGameMenu(){
        this.isMenuPopupShown && this.hideMenuPopup();
    }

    showMenuPopup(){
        utils.active(this.menuPopup);
        this.isMenuPopupShown = true;
        this.menuPopup.on('touchstart', this._onTouchGameMenu, this);
    }

    hideMenuPopup(){
        utils.deactive(this.menuPopup);
        this.isMenuPopupShown = false;
        this.menuPopup.off('touchstart', this._onTouchGameMenu, this);
    }

    onClickChatButton(event) {
        app.system.info(app.res.string('coming_soon'));
    }

    onClickTopupButton(event) {
        app.system.info(app.res.string('coming_soon'));
    }
}

app.createComponent(GameMenuPrefab);