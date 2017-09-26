import app from 'app'
import Component from 'Component'

class Draggable extends Component {
    constructor() {
        super()
        
        this._state = Draggable.STATE_IDLE
        
        this._prePos = null
    }
    
    onLoad() {
        super.onLoad()
        
        this._state = Draggable.STATE_IDLE
        
        this._prePos = this.node.getPosition()
    }
    
    onEnable() {
        super.onEnable()
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }
    
    onDestroy() {
        super.onDestroy()
    }
    
    _onTouchStart(e) {
        this._state = Draggable.STATE_IDLE    
    }
    
    _onTouchMove(e) {
        let delta = e.touch.getDelta();
        this.node.setPosition(cc.v2(this.node.getPosition().x + delta.x, this.node.getPosition().y + delta.y))
        this._state = Draggable.STATE_MOVING
    }
    
    _onTouchEnd(e) {
        let isOut = this._isOutThreshold()
        
        this._prePos = this.node.getPosition();

        if(isOut && this._state == Draggable.STATE_MOVING) 
            this._state = Draggable.STATE_MOVED
        else 
            this._state = Draggable.STATE_IDLE
    }
    
    isMoved() {
        return this._state == Draggable.STATE_MOVED
    }
    
    isIdle() {
        return this._state == Draggable.STATE_IDLE
    }
    
    _isOutThreshold() {
        let threshold = this.node.getContentSize().width / 3
        let _curPos = this.node.getPosition()
        return Math.abs(_curPos.x - this._prePos.x) >= threshold || Math.abs(_curPos.y - this._prePos.y) >= threshold
    }
}

Draggable.STATE_IDLE = 0
Draggable.STATE_MOVING = 1
Draggable.STATE_MOVED = 2

app.createComponent(Draggable)