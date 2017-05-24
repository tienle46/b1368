import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';

class BowlDishControl extends Component {
    constructor() {
        super();
        
        this.properties = {
            ...this.properties,
            wrapper: cc.Node,
            bowlNode: cc.Node,
            circleGroup: cc.Node,
            timeLineNode: cc.Node
        }
    }

    onLoad() {
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
    
    resetBowlPosition() {
        this.bowlNode.setPosition(this.bowlPos);
        
        this.bowlNode.zIndex = 1;
        this.timeLineNode.zIndex = 2;
        
        this.circleGroup.children.forEach(child => child.destroy());
        this.circleGroup.removeAllChildren();
    }

    dishShaker() {
        let startPos = this.wrapper.getPosition();
        this.bowlNode.setPosition(this.bowlPos);

        let shakers = [cc.delayTime(0.5).clone(), startPos, { x: startPos.x, y: startPos.y + 1 }, { x: startPos.x, y: startPos.y - 4 }, { x: startPos.x + 3, y: startPos.y }, { x: startPos.x - 7, y: startPos.y - 4 }, { x: startPos.x + 3, y: startPos.y + 2 }, { x: startPos.x - 6, y: startPos.y + 1 }, { x: startPos.x - 12, y: startPos.y - 1 }, { x: startPos.x - 14, y: startPos.y - 2 }, { x: startPos.x - 7, y: startPos.y - 4 }, { x: startPos.x - 7, y: startPos.y - 9 }, { x: startPos.x, y: startPos.y - 9 }, startPos];
        let actions = shakers.map((s) => cc.moveTo(0.01, cc.v2(s.x, s.y)).clone());

        let sequence = cc.repeatForever(cc.sequence(actions));
        this.wrapper.runAction(sequence);
    }

    stopDishShaker() {
        let startPos = this.wrapPos;
        this.wrapper.stopAllActions();
        this.wrapper.setPosition(startPos);
        this.wrapPos = startPos;
        this._clearTimeout();
    }

    openBowlAnim() {
        let bowlPos = this.bowlPos;
        
        let action = cc.moveTo(1, cc.v2(-67, bowlPos.y));
        this.bowlNode.runAction(cc.sequence(action, cc.callFunc(() => {
            this.bowlPos = bowlPos;
            this.bowlNode.zIndex = 3;
        })));
    }

    initDotsArray(dots = []) {
        // 0: white, 1: red
        let colors = ['blueTheme/ingame/xocdia/trang', 'blueTheme/ingame/xocdia/do'];

        /**
         *              ^
         * IV(-1, 1)    | +1        I(1;1)
         *  -1          |         +1
         * <-|----------0----------|->
         *              | 
         * III(-1, -1)  | -1        II(1, -1)
         *              v
         */
        let randomPosInRange = [{ x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }, { x: -1, y: 1 }];
        let acceptedArea = this.circleGroup.getContentSize();
        let random = app._.random;
        let size = cc.size(18, 18);
        
        dots.forEach((dot, i) => {
            let posX = random(random(0, 1 / 2), randomPosInRange[i].x * (acceptedArea.width - size.width) / 2);
            let posY = random(random(0, 1 / 2), randomPosInRange[i].y * (acceptedArea.height - size.height) / 2);
            let nodeOptions = {
                size: size,
                position: cc.v2(posX, posY),
                name: 'dot',
                sprite: {
                    spriteFrame: colors[dot],
                    type: cc.Sprite.Type.SLICE,
                    sizeMode: cc.Sprite.SizeMode.CUSTOM,
                }
            };

            let node = NodeRub.createNodeByOptions(nodeOptions);
            this.circleGroup.addChild(node);
        });
    }
}

app.createComponent(BowlDishControl);