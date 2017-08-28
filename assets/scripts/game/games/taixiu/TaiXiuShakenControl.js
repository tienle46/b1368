import app from 'app';
import ShakenControl from 'ShakenControl';

export default class TaiXiuShakenControl extends ShakenControl {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            dices: cc.SpriteAtlas,
            diceSprite: cc.Sprite,
            dealerShakes: cc.SpriteAtlas,
            dealerNode: cc.Node,
            openBowlRibbon: cc.Node
        });
    }

    /**
     * @override
     * 
     * @memberof TaiXiuShakenControl
     */
    play() {
        this.hideWrapper()
        let clipName = 'taiXiuDealerShakes'
        this.dealerNode.runAction(cc.sequence(cc.fadeIn(.3), cc.callFunc(() => {
            let animation = this.dealerNode.getComponent(cc.Animation) || this.dealerNode.addComponent(cc.Sprite)

            const sprite = this.dealerNode.getComponent(cc.Sprite) || this.dealerNode.addComponent(cc.Sprite)
            sprite.spriteFrame = this.dealerShakes.getSpriteFrames()[0]

            let spriteFrames = this.dealerShakes.getSpriteFrames()
            let clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 6)
            clip.speed = 0.5;
            clip.name = clipName
            clip.wrapMode = cc.WrapMode.Default
            
            //TODO: run sound
            animation.addClip(clip);
            animation.play(clip.name);
            
            this._isShaking = true;
            
            animation.on('finished', () => {
                animation.play(clip.name);
            })
        })))
    }
    
    /**
     * @extending
     * 
     * @memberof TaiXiuShakenControl
     */
    stop() {
        super.stop();
        this.dealerNode.stopAllActions();
        this.dealerNode.runAction(cc.sequence(cc.fadeOut(.1), cc.callFunc(() => {
            const sprite = this.dealerNode.getComponent(cc.Sprite) || this.dealerNode.addComponent(cc.Sprite)
            sprite.spriteFrame = this.dealerShakes.getSpriteFrames()[0]
        })))
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
        
        let bowlPos = this.bowlPos
        
        // open_bowl ribbon action
        let ribbonActions = cc.repeatForever(cc.sequence(cc.fadeIn(.1), cc.scaleTo(.2, 1.07, 1.06), cc.scaleTo(.2, 1, 1)));
        this.openBowlRibbon.runAction(ribbonActions);
        
        let openBowlAction = cc.moveTo(1, cc.v2(bowlPos.x, 451));
        
        this.bowlNode.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(() => {
            this.showWrapper()
            this.openBowlRibbon.stopAllActions()
            this.openBowlRibbon.runAction(cc.sequence(cc.fadeOut(.2), cc.callFunc(() => {
                this.openBowlRibbon.scaleX = 1
                this.openBowlRibbon.scaleY = 1
            })))
        }), cc.delayTime(.5), openBowlAction, cc.callFunc(() => {
            this.bowlPos = bowlPos
            this.bowlNode.zIndex = 3
        })))
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
        
        let randomPosInRange = [{ x: app._.random(-1, 1), y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }]
        let acceptedArea = this.placedArea.getContentSize()
        let size = this.diceSprite.node.getContentSize()
        
        dices.forEach((dice, i) => {
            let posX = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].x * (acceptedArea.width - size.width) / 2)
            if(i != 0) 
                posX = randomPosInRange[i].x * (acceptedArea.width - size.width) / 2 + randomPosInRange[i].x * app._.random(1/2, 1)
            
            let posY = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].y * (acceptedArea.height - size.height) / 2)
           
            this.diceSprite.spriteFrame = this._getDiceSpriteFrame(dice)
            
            let node = cc.instantiate(this.diceSprite.node)
            node.active = true
            node.setPosition(cc.v2(posX, posY))
            
            this.placedArea.addChild(node)
        });
    }
    
    showWrapper() {
        this.wrapper.active = true
    }
    
    hideWrapper() {
        this.wrapper.active = false
    }
    
    _getDiceSpriteFrame(dice) {
        return this.dices.getSpriteFrame(`dice_${dice}`)
    }
}

app.createComponent(TaiXiuShakenControl);