import app from 'app';
import Component from 'Component';
import { isFunction, numberFormat } from 'Utils';
import RubUtils from 'RubUtils';
import { destroy } from 'CCUtils';

class PlayerInvitePopup extends Component {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            bgTransparent: cc.Node,
            gameCodeLbl: cc.Label,
            userSprite: cc.Sprite,
            userNameLbl: cc.Label,
            userGoldLbl: cc.Label,
            roomInfoRxt: cc.RichText,
            invokerSprite: cc.Sprite,
            invokerNameLbl: cc.Label,
            invokerGoldLbl: cc.Label
        };
        
        this._acceptListener = null;
        this._denyListener = null;
    }
    
    onLoad() {
        super.onLoad();
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => true);

        app.context.getUserAvatar(this.userSprite);
        
        let {name, coin} = app.context.getMyInfo();
        
        this.userNameLbl.string = name;
        this.userGoldLbl.string = numberFormat(coin);
        
        this.gameCodeLbl.string = app.context.getSelectedGame() ? app.const.gameLabels[app.context.getSelectedGame()] : "";
    }
    
    /**
     * 
     * @param {username: string, userCoin: int, avatarUrl: string, bet: int} invoker 
     * @param {func} acceptListener 
     * @param {func} denyListener 
     * @param {cc.Node} node 
     * 
     * @memberOf PlayerInvitePopup
     */
    init(node, invoker, acceptListener, denyListener) {
        let {username, userCoin, avatarUrl, bet} = invoker;
        avatarUrl && RubUtils.loadSpriteFrame(this.invokerSprite, avatarUrl, null, true);
        this.invokerNameLbl.string = username;
        this.invokerGoldLbl.string = numberFormat(userCoin);
        
        this.roomInfoRxt.string = `Tiền cược <color=#FFE000>${bet}</c>`;
        
        this._acceptListener = acceptListener;
        this._denyListener = denyListener;
        
        node.addChild(this.node);
    }
    
    
    onDenyBtnClick() {
        this.close();
        this._denyListener && this._denyListener();
    }
    
    onAcceptBtnClick() {
        this.close();
        this._acceptListener && this._acceptListener();
    }
    
    close() {
        if (this.node) {
            this.node.active = false;
            destroy(this.node);
        }
    }
    
    onDestroy() {
        super.onDestroy();
        this._acceptListener = null;
        this._denyListener = null;
    }
}

app.createComponent(PlayerInvitePopup);