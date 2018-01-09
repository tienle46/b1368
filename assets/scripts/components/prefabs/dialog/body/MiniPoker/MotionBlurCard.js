import app from 'app';
import BaseCard from 'BaseCard';

class MotionBlurCard extends BaseCard {

    constructor() {
        super();

        this.properties = this.assignProperties({
            mainCard: cc.Node,
            tailCard1: cc.Node,
            tailCard2: cc.Node,
            tailCard3: cc.Node
        });

        this.isMotionBlurEnabled = true;
    }

    initWithCardValue(cardValue) {
        super.initWithCardValue(cardValue);
        this._setCardUI();
    }

    _setCardUI() {
        if (!this.mainCard || !this.tailCard1 || !this.tailCard2 || !this.cardSpriteAtlas) {
            return;
        }

        var mainCardSprite = this.mainCard.getComponent(cc.Sprite);
        var tailCard1Sprite = this.tailCard1.getComponent(cc.Sprite);
        var tailCard2Sprite = this.tailCard2.getComponent(cc.Sprite);
        var tailCard3Sprite = this.tailCard3.getComponent(cc.Sprite);

        mainCardSprite.spriteFrame = this.cardSpriteFrame;
        tailCard1Sprite.spriteFrame = this.cardSpriteFrame;
        tailCard2Sprite.spriteFrame = this.cardSpriteFrame;
        tailCard3Sprite.spriteFrame = this.cardSpriteFrame;

        this.enableMotionBlur(false);
    }

    enableMotionBlur(isEnabled) {
        this.isMotionBlurEnabled = isEnabled;

        this.tailCard1.active = isEnabled;
        this.tailCard2.active = isEnabled;
        this.tailCard3.active = isEnabled;
    }

}

app.createComponent(MotionBlurCard);