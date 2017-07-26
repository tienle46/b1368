import app from 'app';
import ShakenControl from 'ShakenControl';
import NodeRub from 'NodeRub';

class TaiXiuShakenControl extends ShakenControl {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            dices: {
                type: cc.SpriteAtlas,
                default: null
            }
        });
    }
    
     /**
     * @override
     * 
     * @param {any} [dices=[]] 
     * @memberof TaiXiuShakenControl
     */
    placedOnDish(dices = []) {
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
        
        let randomPosInRange = [{ x: app._.random(-1/2, 1/2), y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }];
        let acceptedArea = this.placedArea.getContentSize();
        let size = cc.size(18, 18);
        
        dices.forEach((dice, i) => {
            let posX = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].x * (acceptedArea.width - size.width) / 2);
            let posY = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].y * (acceptedArea.height - size.height) / 2);
            let nodeOptions = {
                size,
                position: cc.v2(posX, posY),
                name: 'dice',
                sprite: {
                    spriteFrame: this.dices.getSpriteFrame(`dice_${dice}`)
                }
            };

            let node = NodeRub.createNodeByOptions(nodeOptions);
            this.placedArea.addChild(node);
        });
    }
}

app.createComponent(TaiXiuShakenControl);