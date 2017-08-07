import app from 'app';
import ShakenControl from 'ShakenControl';

class TaiXiuShakenControl extends ShakenControl {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            dices: {
                type: cc.SpriteAtlas,
                default: null
            },
            diceSprite: cc.Sprite
        });
    }

    
    /**
     * @override
     * 
     * @returns 
     * @memberof TaiXiuShakenControl
     */
    openTheBowl() {
        if(this.isShaking())
            return;
        
        let bowlPos = this.bowlPos;
        
        let action = cc.moveTo(1, cc.v2(bowlPos.x, 451));
        this.bowlNode.runAction(cc.sequence(action, cc.callFunc(() => {
            this.bowlPos = bowlPos;
            this.bowlNode.zIndex = 3;
        })));
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
         *       I([-1, 1], 1)
         *              
         *              |
         * <-|----------0----------|->
         *              | 
         * III(-1, -1)  | -1        II(1, -1)
         *              v
         */
        
        let randomPosInRange = [{ x: app._.random(-1, 1), y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }];
        let acceptedArea = this.placedArea.getContentSize();
        let size = this.diceSprite.node.getContentSize();
        
        dices.forEach((dice, i) => {
            let posX = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].x * (acceptedArea.width - size.width) / 2);
            let posY = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].y * (acceptedArea.height - size.height) / 2);
           
            this.diceSprite.spriteFrame = this.dices.getSpriteFrame(`dice_${dice}`)
            
            let node = cc.instantiate(this.diceSprite.node)
            node.active = true
            node.setPosition(cc.v2(posX, posY))
            
            this.placedArea.addChild(node)
        });
    }
}

app.createComponent(TaiXiuShakenControl);