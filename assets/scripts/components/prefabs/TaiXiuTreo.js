import app from 'app'
import Actor from 'Actor'

/**
 * This component MUST BE placed in lower level than Draggable Component (if any)
 * Otherwise, remove an EventListener in `onEnable` method and using cc.Button -> clickEvents instead
 * 
 * @class Threshold
 * @extends {Component}
 */
class TaiXiuTreo extends Actor {
    constructor() {
        super()
        
        this.properties = this.assignProperties({
            popup: cc.Prefab,
            remainTime: cc.Label
        })
    }
    
    onLoad() {
        super.onLoad()
        this.draggable = this.node.getComponent('Draggable')
    }
    
    start() {
        super.start()
    }
    
    onEnable() {
        super.onEnable()
        this.node.on(cc.Node.EventType.TOUCH_END, this._onClick, this)
    }
    
    _addGlobalListener() {
        super._addGlobalListener();
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
    }
    
    onDestroy() {
        super.onDestroy()
        if(app.taiXiuTreoManager) {
            app.taiXiuTreoManager.onDestroy()
        }
    }
    
    _onClick() {
        if(this.draggable && this.draggable.isIdle()) {
            if(app.taiXiuTreoManager.needRequestNew())
                app.service.send({
                    cmd: app.commands.MINIGAME_TAI_XIU_GET_STATE
                })
            else
                app.taiXiuTreoManager.showPopup()
        }
    }
    
    createPopup(data) {
        let {state} = data
        
        if(state == 0)
            return
            
        let popup = cc.instantiate(this.popup)
        let popupComponent = popup.getComponent('TaiXiuTreoPopup')
        
        return popupComponent
    }
    
    runCountDown(remain) {
        this.remainTime.node.stopAllActions()
        
        this.remainTime.string = remain
        
        this.remainTime.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.callFunc(() => {
                        this.remainTime.string = remain
                        remain -= 1
                        if(remain < 0) {
                            this.remainTime.node.stopAllActions()
                        }
                    }),
                    cc.delayTime(1)
                )
            )
        )
    }
}

app.createComponent(TaiXiuTreo)