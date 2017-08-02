import app from 'app';
import ShakenControl from 'ShakenControl';
import NodeRub from 'NodeRub';

class XocDiaShakenControl extends ShakenControl {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            colors: {
                default: [],
                type: [cc.SpriteFrame]
            }
        });
    }
    
    reset() {
        super.reset();
    }
    
    /**
     * @override
     * 
     * @returns 
     * @memberof XocDiaShakenControl
     */
    openTheBowl() {
        if(this.isShaking())
            return;
        
        let bowlPos = this.bowlPos;
        
        let action = cc.moveTo(1, cc.v2(-67, bowlPos.y));
        this.bowlNode.runAction(cc.sequence(action, cc.callFunc(() => {
            this.bowlPos = bowlPos;
            this.bowlNode.zIndex = 3;
        })));
    }
    
    /**
     * @override
     * 
     * @param {any} [dots=[]] 
     * @memberof XocDiaShakenControl
     */
    placedOnDish(dots = []) {
        // 0: white, 1: red
        // let colors = ['blueTheme/ingame/xocdia/trang', 'blueTheme/ingame/xocdia/do'];

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
        let acceptedArea = this.placedArea.getContentSize();
        let size = cc.size(18, 18);
        
        dots.forEach((dot, i) => {
            let posX = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].x * (acceptedArea.width - size.width) / 2);
            let posY = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].y * (acceptedArea.height - size.height) / 2);
            let nodeOptions = {
                size,
                position: cc.v2(posX, posY),
                name: 'dot',
                sprite: {
                    spriteFrame: this.colors[dot]
                }
            };

            let node = NodeRub.createNodeByOptions(nodeOptions);
            this.placedArea.addChild(node);
        });
    }
}

app.createComponent(XocDiaShakenControl);