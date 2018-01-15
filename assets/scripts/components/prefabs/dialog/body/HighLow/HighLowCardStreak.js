import app from 'app';
import Actor from 'Actor';
import HighLowCardHand from './HighLowCardHand';

class HighLowCardStreak extends Actor {    
    constructor() {
        super();  
        
        this.properties = this.assignProperties({
            cardAtlas: cc.SpriteAtlas,
            cardSprite: cc.Sprite,
        });
                
        this.animating = false;
        this.duration = 0;
        this.elapsedTime = 0;   
        this.curCardValue = 0;     
        this.cardValues = [];
        
        this.onComplete = null;
    }
    
    onEnable() {
        super.onEnable();
        
    }
    
    onDisable() {
        super.onDisable();
        
    }
    
    startAnimate(duration, cardValue, onComplete) {
        this._generateCardValues(cardValue)
        this.duration = duration;
        this.onComplete = onComplete;
        
        this.animating = true;
    }
    
    _reset() {
        this.duration = 0;
        this.elapsedTime = 0;
        this.animating = false;
        this.onComplete = null;
        this.curCardValue = 0;
        this.cardValues.splice(0, this.cardValues.length)
    }
    
    _generateCardValues(cardValue) {
        // Todo: generate and update card values
        for (i=0; i<HighLowCardStreak.NUM_OF_RANDOM_CARD; i++) {
            this.cardValues.push(this._randomCardValue())
        }
        this.cardValues.push(cardValue)
    }
    
    _randomCardValue() {
        return Math.floor(Math.random() * 52 + 4);
    }
    
    _getCardSpriteFrameNameForCardValue(cardValue) {
        // Todo: return card sprite frame name with the given card value
        return this.cardAtlas.getSpriteFrame(HighLowCardHand.getSpriteName(cardValue))
    }
    
    update(dt) {
        if (!this.animating) return;
        
        if (this.elapsedTime > this.duration && this.curCardValue === this.cardValues[this.cardValues.length - 1]) {
            if (this.onComplete) {
                this.onComplete();
            }
            this._reset();
            return;
        }
        this.elapsedTime += dt;
        var cardValue = this._getCardValueForElapsedTime();
        if (cardValue === this.curCardValue) return;
        
        var cardSpriteFrame = this._getCardSpriteFrameNameForCardValue(cardValue);
        this.curCardValue = cardValue;
        this.cardSprite.spriteFrame = cardSpriteFrame;
    }
    
    _getCardValueForElapsedTime() {
        var length = this.cardValues.length
        const stepTime = this.duration / length;
        var idx = Math.floor(this.elapsedTime / stepTime);
        if (idx >= length) idx = length - 1;
        var result = this.cardValues[idx];
        
        // console.warn("idx", idx, "result", result);
        
        return result;
    }
}

HighLowCardStreak.NUM_OF_RANDOM_CARD = 7;

app.createComponent(HighLowCardStreak);