import Component from 'Component';

export default class ShakenControl extends Component {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            wrapper: cc.Node,
            bowlNode: cc.Node,
            timeLineNode: cc.Node,
            placedArea: cc.Node
        });
        
        this._isShaking = false;
        this.timeout = null;
    }

    onLoad() {
        super.onLoad();
        this.timeout = null;
        this.bowlPos = this.bowlNode.getPosition();
        
        this.wrapPos = this.wrapper.getPosition();
    }
    
    onDestroy() {
        super.onDestroy();
        this._clearTimeout();
    }
    
    _clearTimeout() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    
    reset() {
        this.bowlNode.setPosition(this.bowlPos);
        
        this.bowlNode.zIndex = 1;
        this.timeLineNode.zIndex = 2;
        
        this.placedArea.children.forEach(child => child.destroy());
        this.placedArea.removeAllChildren(false);
    }

    play() {
        let startPos = this.wrapper.getPosition();
        this.bowlNode.setPosition(this.bowlPos);

        let shakers = [cc.delayTime(0.5).clone(), startPos, { x: startPos.x, y: startPos.y + 1 }, { x: startPos.x, y: startPos.y - 4 }, { x: startPos.x + 3, y: startPos.y }, { x: startPos.x - 7, y: startPos.y - 4 }, { x: startPos.x + 3, y: startPos.y + 2 }, { x: startPos.x - 6, y: startPos.y + 1 }, { x: startPos.x - 12, y: startPos.y - 1 }, { x: startPos.x - 14, y: startPos.y - 2 }, { x: startPos.x - 7, y: startPos.y - 4 }, { x: startPos.x - 7, y: startPos.y - 9 }, { x: startPos.x, y: startPos.y - 9 }, startPos];
        let actions = shakers.map((s) => cc.moveTo(0.01, cc.v2(s.x, s.y)).clone());

        let sequence = cc.repeatForever(cc.sequence(actions));
        this._isShaking = true;
        this.wrapper.runAction(sequence);
    }

    stop() {
        let startPos = this.wrapPos;
        this._isShaking = false;
        this.wrapper.stopAllActions();
        this.wrapper.setPosition(startPos);
        this.wrapPos = startPos;
        this._clearTimeout();
    }
    
    isShaking() {
        return this._isShaking;
    }
    
    /**
     * @interface
     * 
     * @memberof ShakenControl
     */
    openTheBowl() {}
    
    hide() {
        this.node.runAction(cc.sequence(cc.fadeOut(.3), cc.callFunc(() => {
            this.node.active = false;
        })));
    }
    
    show() {
        this.node.active = true;
        // this.node.opacity = 255;
        this.node.runAction(cc.fadeIn(.3));
    }
    
    /**
     * @interface
     * 
     * @param {any} [dots=[]] 
     * @memberof ShakenControl
     */
    placedOnDish(dots = []) {}
}