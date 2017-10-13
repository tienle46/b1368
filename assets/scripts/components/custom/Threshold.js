import app from 'app'
import Component from 'Component'

/**
 * Auto transformance a node to the threshold edge of Canvas
 * This component MUST BE placed in lower level than Draggable Component
 * 
 * @class Threshold
 * @extends {Component}
 */
class Threshold extends Component {
    constructor() {
        super()
    }
    
    onLoad() {
        super.onLoad()
        this.node.opacity = 180
        
        this.draggable = this.node.getComponent('Draggable')
    }
    
    onEnable() {
        super.onEnable()
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }
    
    onDestroy() {
        super.onDestroy()
    }
    
    _onTouchStart(e) {
        // e.stopPropagationImmediate()
        this.node.opacity = 255
    }
    
    _onTouchEnd(e) {
        // e.stopPropagationImmediate()
        if(this.draggable) {
            let T = this._componentShouldBeMovedTo(this.node.getPosition())
            this._moveToThreshold(T)
        }
        this.node.opacity = 180
    }
    
    _moveToThreshold(type) {
        this.node.stopAllActions()
        
        let time = .2
        let curPos = this._getNodeSpace()
        let nodeSize = this.node.getContentSize()
        let winSize = this._getWinSize()
        
        if(type == Threshold.WINDOW_EDGE_TYPE_TOP || type == Threshold.WINDOW_EDGE_TYPE_BOTTOM) {
            this.node.runAction(cc.moveTo(time, cc.v2(curPos.x, (type == Threshold.WINDOW_EDGE_TYPE_BOTTOM ? - 1: 1) * ((winSize.height - nodeSize.height) / 2 - Threshold.WINDOW_PADDING))))
        } else if (type == Threshold.WINDOW_EDGE_TYPE_RIGHT || type == Threshold.WINDOW_EDGE_TYPE_LEFT) {
            this.node.runAction(cc.moveTo(time, cc.v2((type == Threshold.WINDOW_EDGE_TYPE_LEFT ? - 1: 1) * ((winSize.width - nodeSize.width) / 2 - Threshold.WINDOW_PADDING), curPos.y)))
        }
    }
    
    _getNodeSpace() {
        return cc.director.getScene().convertToNodeSpace(this.node.getPosition())
    }
    
    /**
     * get Symmetry of Point
     * 
     * @param {any} x 
     * @param {any} y 
     * @returns Array [{x; 0} => via Ox, {0; y} => via Ox, {0; 0} => via (0; 0)]
     * @memberof TestScene
     */
    _getSymmetryPoints(point) {
        let {x, y} = point
        
        return [{x, y: (-1) * y}, {x: (-1) * x, y}, {x: (-1) * x, y: (-1) * y}]
    }
    
    /**
     * Generate a rectangle with Width and Height and the default anchor point (0.5; 0.5)
     * 
     * @param {any} w 
     * @param {any} h 
     * @returns 
     * @memberof TestScene
     */
    _generateRectangle(w, h) {
        let p = cc.v2(w/2, h/2)
        return [...this._getSymmetryPoints(p), p]
    }
    
    _componentShouldBeMovedTo(p) {
        let winSize = this._getWinSize()
        let R = this._generateRectangle(winSize.width, winSize.height)
        // edges setting
        let ES = { 
            [Threshold.WINDOW_EDGE_TYPE_TOP]: [R[1], R[3]], // top
            [Threshold.WINDOW_EDGE_TYPE_BOTTOM]: [R[0], R[2]], // bottom
            [Threshold.WINDOW_EDGE_TYPE_RIGHT]: [R[0], R[3]], // right
            [Threshold.WINDOW_EDGE_TYPE_LEFT]: [R[1], R[2]] // left
        }
        
        let T = null // Type of Line
        let tmp = 9999
        
        for(let k in ES) {
            let v = this._pDistance(p, ES[k][0], ES[k][1])
            if(tmp >= v) {
                tmp = v
                T = k
            }
        }
        
        return T
    }
    
    _getWinSize() {
        return cc.director.getVisibleSize()
    }
    
    /**
     * Distance between point P to a Line (established from 2 points V, W)
     * 
     * @param {any} p 
     * @param {any} v 
     * @param {any} w 
     * @returns 
     * @memberof TestScene
     */
    _pDistance(p, v, w) {
        let {x, y} = p
        let x1 = v.x,
            y1 = v.y;
        let x2 = w.x,
            y2 = w.y;
            
        var A = x - x1;
        var B = y - y1;
        var C = x2 - x1;
        var D = y2 - y1;
    
        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;
    
        var xx, yy;
    
        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }
    
        var dx = x - xx;
        var dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    isTransformed() {
        return this._currentPos.x == this._prevPos.x && this._currentPos.y == this._prevPos.y
    }
}

Threshold.WINDOW_EDGE_TYPE_TOP = "T"
Threshold.WINDOW_EDGE_TYPE_BOTTOM = "B"
Threshold.WINDOW_EDGE_TYPE_LEFT = "L"
Threshold.WINDOW_EDGE_TYPE_RIGHT = "R"
Threshold.WINDOW_PADDING = 5

app.createComponent(Threshold)