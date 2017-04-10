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
            roomBetLbl: cc.Label,
            roomCapacityLbl: cc.Label,
            roomBalanceLbl: cc.Label,
            invokerSprite: cc.Sprite,
            invokerNameLbl: cc.Label,
            invokerGoldLbl: cc.Label,
            invokerLevelLbl: cc.Label,
            checkBox: cc.Toggle
        };
        
        this._acceptListener = null;
        this._denyListener = null;
    }
    
    onLoad() {
        super.onLoad();
        this.bgTransparent.on(cc.Node.EventType.TOUCH_START, () => true);
        this.checkBox.isChecked = !app.system.marker.getItemData(app.system.marker.SHOW_INVITATION_POPUP_OPTION);
    }
    
    /**
     * 
     * @param {username: string, userCoin: int, avatarUrl: string, bet: int, roomCapacity: string, roomBalance: int} invoker 
     * @param {func} acceptListener 
     * @param {func} denyListener 
     * @param {cc.Node} node 
     * 
     * @memberOf PlayerInvitePopup
     */
    init(node, invoker, acceptListener, denyListener) {
        let {username, userCoin, avatarUrl, bet, roomCapacity, roomBalance} = invoker;
        avatarUrl && RubUtils.loadSpriteFrame(this.invokerSprite, avatarUrl, null, true);
        this.invokerNameLbl.string = username;
        this.invokerGoldLbl.string = numberFormat(userCoin);
        
        this.roomBetLbl.string = numberFormat(bet);
        this.roomCapacityLbl.string = roomCapacity;
        this.roomBalanceLbl.string = numberFormat(roomBalance);
        
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
        if(this.checkBox.isChecked)
            app.system.marker.setItem(app.system.marker.SHOW_INVITATION_POPUP_OPTION, !this.checkBox.isChecked);
        
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