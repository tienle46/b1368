import app from 'app';
import ShakenControl from 'ShakenControl';
import NodeRub from 'NodeRub';

class XocDiaShakenControl extends ShakenControl {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            circleGroup: cc.Node,
            colors: {
                default: [],
                type: [cc.SpriteFrame]
            }
        });
    }
    
    reset() {
        super.reset();
        
        this.circleGroup.children.forEach(child => child.destroy());
        this.circleGroup.removeAllChildren();
    }

    initDotsArray(dots = []) {
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
                    spriteFrame: this.colors[dot]
                }
            };

            let node = NodeRub.createNodeByOptions(nodeOptions);
            this.circleGroup.addChild(node);
        });
    }
}

app.createComponent(XocDiaShakenControl);