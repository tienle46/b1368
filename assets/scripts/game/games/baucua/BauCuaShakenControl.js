import app from 'app';
import TaiXiuShakenControl from 'TaiXiuShakenControl';

class BauCuaShakenControl extends TaiXiuShakenControl {
    constructor() {
        super();
        
        this.faceTypeIdToName = {
            1 : 'bau',
            2 : 'cua',
            3 : 'tom',
            4 : 'ca',
            5 : 'ga',
            6 : 'huou',
        }
    }

     /**
     * @override
     * 
     * @param {any} [dices=[]] 
     * @memberof BauCuaShakenControl
     */
    placedOnDish(dices = []) {
        let randomPosInRange = [{ x: app._.random(-1, 1), y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }]
        let acceptedArea = this.placedArea.getContentSize()
        let size = this.diceSprite.node.getContentSize()
        
        dices.forEach((dice, i) => {
            let posX = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].x * (acceptedArea.width - size.width) / 2)
            if(i != 0) 
                posX = randomPosInRange[i].x * (acceptedArea.width - size.width) / 2 + randomPosInRange[i].x * app._.random(1/2, 1)
            
            let posY = app._.random(app._.random(0, 1 / 2), randomPosInRange[i].y * (acceptedArea.height - size.height) / 2)
           
            this.diceSprite.spriteFrame = this.dices.getSpriteFrame(this.faceTypeIdToName[dice])
            
            let node = cc.instantiate(this.diceSprite.node)
            node.active = true
            node.setPosition(cc.v2(posX, posY))
            this.placedArea.addChild(node)
        });
    }
}

app.createComponent(BauCuaShakenControl);