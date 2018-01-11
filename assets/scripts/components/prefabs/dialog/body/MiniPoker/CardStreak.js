import app from 'app';
import Actor from 'Actor';
import MotionBlurCard from 'MotionBlurCard';
import CustomEaseBackInOut from 'EaseBackInOut';

class CardStreak extends Actor {
    constructor() {
        super();

        this.properties = this.assignProperties({
            motionBlurPrefab: cc.Prefab,
            container: cc.Node,
        });
    }

    doAnimation() {
        this._removeCards();
        this._generateCard();

        var lastChild = this.container.children[this.container.children.length - 1];
        (lastChild && lastChild.getComponent(MotionBlurCard).enableMotionBlur(false));
    }

    spinToCard(cardValue, duration = 0, onComplete) {
        this._spinToCardWithAnimation(cardValue, duration, onComplete);
    }

    _spinToCardWithoutAnimation(cardValue, onComplete) {
        this._removeCards();
        var lastMotionBlurCard = cc.instantiate(this.motionBlurPrefab);
        lastMotionBlurCard.position = cc.p(0, CardStreak.START_Y + 1 * CardStreak.CARD_HEIGHT);
        var motionCardController = lastMotionBlurCard.getComponent(MotionBlurCard);
        motionCardController.initWithCardValue(cardValue);
        motionCardController.enableMotionBlur(false);

        var curY = this.container.y;
        var targetY = curY - 1 * CardStreak.CARD_HEIGHT;
        this.container.y = targetY;
        if (onComplete) {
            onComplete();
        }
    }

    _spinToCardWithAnimation(cardValue, duration, onComplete) {
        this._removeCards();
        this._generateCard();
        var lastMotionBlurCard = cc.instantiate(this.motionBlurPrefab);
        lastMotionBlurCard.position = cc.p(0, CardStreak.START_Y + (CardStreak.NUM_RANDOM_CARD + 1)* CardStreak.CARD_HEIGHT);
        var motionCardController = lastMotionBlurCard.getComponent(MotionBlurCard);
        motionCardController.initWithCardValue(cardValue);
        motionCardController.enableMotionBlur(false);
        this.container.addChild(lastMotionBlurCard);

        this._doAnimation(duration, onComplete);
    }

    _doAnimation(duration, onComplete) {
        var curY = this.container.y;
        var targetY = curY - (CardStreak.NUM_RANDOM_CARD + 1) * CardStreak.CARD_HEIGHT;
        var moveTo = cc.sequence(cc.moveTo(duration, this.container.x, targetY ).easing(cc.easeIn(1.5)),
            cc.callFunc(() => {
                if (onComplete) {
                    onComplete();
                }
            }));
        this.container.runAction(moveTo);
    }

    _removeCards() {
        if (this.container.children.length <= 1) return;

        var children = this.container.children;
        for (var i = 0; i < children.length - 1; i ++) {
            this.container.removeChild(children[i]);
        }
        var lastChild = children[children.length - 1];
        this.container.y = -CardStreak.START_Y;
        lastChild.y = CardStreak.START_Y;

    }

    _generateCard() {
        for (var i = 1; i <= CardStreak.NUM_RANDOM_CARD; i ++) {
            var motionBlurCard = cc.instantiate(this.motionBlurPrefab);
            motionBlurCard.position = cc.p(0, CardStreak.START_Y + i * CardStreak.CARD_HEIGHT);
            this.container.addChild(motionBlurCard);
            var motionCardController = motionBlurCard.getComponent(MotionBlurCard);
            var cardValue = this._randomCardValue();
            motionCardController.initWithCardValue(cardValue);
            motionCardController.enableMotionBlur(true);
        }
    }

    _randomCardValue() {
        return Math.floor(Math.random() * 52 + 4);
    }

}

CardStreak.NUM_RANDOM_CARD = 15;
CardStreak.CARD_HEIGHT = 185;
CardStreak.START_Y = 83;

app.createComponent(CardStreak);