import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';
import HighLowSpecialCard from 'HighLowSpecialCard';

class HighLowPopup extends BasePopup {
    constructor() {
        super();

        this.properties = this.assignProperties({
            playFrame : cc.Sprite,
            card: CardStreak,
            highLowAtlas: cc.SpriteAtlas,
            atGroup: cc.Node,
        });
        this.atCount = 0
    }
    
    onStartBtnClicked() {
        if(this.playFrame.node.active == true) {
            this.playFrame.node.active = false
            this.card.node.active = true
        }
    }
    
    onPlayBtnClicked() {
        if(this.card.node.active == true){
            let cardValue = this.card._randomCardValue()
            this.card.spinToCard(cardValue, 3, () => {
                if(cardValue < 8) {
                    let children = this.atGroup.children
                    children[this.atCount].getComponent(cc.Sprite).spriteFrame = this.highLowAtlas.getSpriteFrame('A-2')
                    this.atCount ++
                }
            })
        }
    }

    onEnable() {
        super.onEnable();
    }

    onDisable() {
        super.onDisable();
    }

}

app.createComponent(HighLowPopup);