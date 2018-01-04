import BasePopup from 'BasePopup';
import CardStreak from 'CardStreak';

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
        this.isSpinning = false
    }
    
    onStartBtnClicked() {
        if(this.playFrame.node.active == true) {
            this.playFrame.node.active = false
            this.card.node.active = true
        }
    }
    
    _playSpinCard() {
        if(this.card.node.active == true && !this.isSpinning){
            let cardValue = this.card._randomCardValue()
            this.isSpinning = true
            this.card.spinToCard(cardValue, 3, () => {
                this.isSpinning = false
                if(cardValue < 8) {
                    let children = this.atGroup.children
                    children[this.atCount].getComponent(cc.Sprite).spriteFrame = this.highLowAtlas.getSpriteFrame('A-2')
                    this.atCount ++
                }
            })
        }
    }
    
    onHigherBetBtnClicked() {
        this._playSpinCard()
    }
    onLowerBetBtnClicked() {
        this._playSpinCard()
    }

    onEnable() {
        super.onEnable();
    }

    onDisable() {
        super.onDisable();
    }

}

app.createComponent(HighLowPopup);