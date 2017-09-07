import app from 'app';
import DialogActor from 'DialogActor';
import { destroy } from 'CCUtils';
import GameUtils from 'GameUtils';
import Utils from 'GeneralUtils';

class CreateRoomDialog extends DialogActor {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            itemNode: cc.Node,
            itemLabel: cc.Label,
            neededLabel: cc.Label,
            itemSprite: cc.Sprite,
            container: cc.Node,
            transparentBg: cc.Node,
            title: cc.Label,
            inactiveSprite: cc.SpriteFrame,
            normalSprite: cc.SpriteFrame
        })
        
        this._previousToggle = null
        this._currentToggle = null
    }

    onLoad() {
        super.onLoad();
        // this._initComponents();
        this.transparentBg.on('touchstart', function() {
            return;
        });
        
        
    }
    
    
    initGrid(parent, {title = "", minBalanceMultiple = null, minBets = [], okBtnCb = null, roomCapacity = null} = {}, context) {            
        let minMoney =  app.context.getMeBalance()/minBalanceMultiple
        
        this.title.string = title
        this._minBalanceMultiple = minBalanceMultiple
        
        this.itemLabel.node.tag = CreateRoomDialog.TAG_LABEL
        this.itemSprite.node.tag = CreateRoomDialog.TAG_BACKGROUND
        
        minBets.forEach((amount, index) => {
            this.itemLabel.string = GameUtils.formatBalanceShort(amount)
            if(amount > minMoney) {
                this.itemSprite.spriteFrame = this.inactiveSprite
            } else {
                this.itemLabel.node.color = app.const.COLOR_WHITE
            }
            
            let item = cc.instantiate(this.itemNode)
            let toggle = item.getComponent(cc.Toggle)
            if(amount > minMoney) {
                toggle.interactable = false
            }
            toggle.isChecked = index == 0
            item.active = true
            item._bet = amount
            
            if(toggle.isChecked && toggle.interactable) 
                this.onItemClick(toggle)
          
            this.container.addChild(item)
        })
        
        this._ctx = context
        this._okBtnCb = okBtnCb
        this._roomCapacity = roomCapacity
        
        
        !this.node.isChildOf(parent) && parent.addChild(this.node);
    }
    
    onCloseBtnClick() {
        destroy(this.node);
    }
    
    onItemClick(e) {
        this._currentToggle = e.node
        this._setState(this._previousToggle, false)
        this._setState(this._currentToggle, true)
        this._amount = e.node._bet
        
        this.neededLabel.string = Utils.numberFormat(this._amount * this._minBalanceMultiple)
    }
    
    okBtnClick() {
        if(!this._currentToggle) {
            app.system.showToast(app.res.string('error_need_to_pick_option_create_room_dialog'))
            return
        }
        
        this._okBtnCb.call(this._ctx, {minBet: this._amount, roomCapacity: this._roomCapacity})
    }
    
    onDestroy() {
        super.onDestroy()
        this._ctx = null
        this._okBtnCb = null
        this._previousToggle = null
        this._currentToggle = null
    }
    
    _setState(toggleNode, active = false) {
        if(!toggleNode)
            return
        
        let toggleBackground = toggleNode.getChildByTag(CreateRoomDialog.TAG_BACKGROUND )
        if(toggleBackground) {
            let sprite = toggleNode.getComponent(cc.Sprite)
            if(sprite) {
                sprite.spriteFrame = active ?  this.normalSprite: this.inactiveSprite
            }
        }
        let toggleLabel = toggleNode.getChildByTag(CreateRoomDialog.TAG_LABEL)
        
        if(toggleLabel) {
            toggleLabel.color = active ? CreateRoomDialog.COLOR_YELLOW : app.const.COLOR_WHITE
        }
        
        this._previousToggle = this._currentToggle
    }
}
CreateRoomDialog.COLOR_GRAY = new cc.Color(50, 63, 87)
CreateRoomDialog.COLOR_YELLOW = new cc.Color(245, 208, 56)
CreateRoomDialog.TAG_BACKGROUND = 101
CreateRoomDialog.TAG_LABEL = 102

app.createComponent(CreateRoomDialog);
