import app from 'app';
import Actor from 'Actor';
import SFS2X from 'SFS2X';
import Events from 'Events';
import utils from 'utils';
import TopupDialogRub from 'TopupDialogRub';
import Keywords from 'Keywords';
import Commands from 'Commands';
import ScrollMessagePopup from 'ScrollMessagePopup';

const ACTION_LUAT_CHOI = 1;

export default class GameMenuPrefab extends Actor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
           menuBtn: cc.Node,
            menuLock: cc.Node,
            chatBtn: cc.Node,
            topupBtn: cc.Node,
            menuPopup: cc.Node,
            exitButton: cc.Button,
            guideButton: cc.Button,
            exitLabel: cc.Label,
            guideLabel: cc.Label,
            jarAnchorPoint: cc.Node
        });

        this.scene = null;
        this.isMenuPopupShown = false;
    }

    onEnable() {
        super.onEnable();
        this.scene = app.system.currentScene;
        utils.deactive(this.menuPopup);
    }
    
    start() {
        super.start();
        let gameCode = app.context.getSelectedGame();
        if(app.jarManager.hasJar(gameCode)) {
            let hasButton = true;
            app.jarManager.addJarToParent(this.jarAnchorPoint, gameCode, hasButton);
        }
    }
    
    _onClickMenuItem(eventName, ...args) {
        this.hide();
        this.scene.emit(eventName, ...args);
    }

    onClickExitButton(event) {
        this.hide();
        this._onClickMenuItem(Events.ON_ACTION_EXIT_GAME);
    }

    onClickGuideButton() {
        this.hide();

        let data = {
            [Keywords.SERVICE_ID]: this.scene.gameCode,
            [Keywords.CLIENT_VERSION]: 1,
            [Keywords.ACTION]: ACTION_LUAT_CHOI,
            "testMode": false
        }

        ScrollMessagePopup.show(this.scene.node, {
            cmd: Commands.RULE_OF_GAME,
            data: data,
            parser: (data) => {
                return data[Keywords.GAME_RULE] ? data[Keywords.GAME_RULE] : data[Keywords.GAME_GUIDE];
            }
        });

    }

    onClickMenuButton(event) {
        // this.isMenuPopupShown ? this.hide() : this.show();
        this.onClickExitButton();
    }

    onClickOutsideMenuPopup() {
        this.hide();
    }

    _onTouchGameMenu() {
        this.isMenuPopupShown && this.hide();
    }
    
    onDisable() {
        this.menuPopup.off('touchstart', this._onTouchGameMenu, this);
    }
    
    onDestroy() {
        super.onDestroy();    
    }
    
    show() {
        utils.active(this.menuPopup);
        this.isMenuPopupShown = true;
        this.menuPopup.on('touchstart', this._onTouchGameMenu, this);
    }

    hide() {
        utils.deactive(this.menuPopup);
        this.isMenuPopupShown = false;
        this.menuPopup.off('touchstart', this._onTouchGameMenu, this);
    }

    onClickChatButton(event) {
        this.scene.emit(Events.VISIBLE_INGAME_CHAT_COMPONENT);
    }

    onClickTopupButton(event) {
        TopupDialogRub.show(this.scene.node);
    }
}

app.createComponent(GameMenuPrefab);