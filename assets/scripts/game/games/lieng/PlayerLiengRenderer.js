import utils from 'PackageUtils';
import app from 'app';
import CardList from 'CardList';
import GameUtils from 'GameUtils';
import PlayerCardRenderer from 'PlayerCardRenderer';
import GameAnim from "../../components/anim/GameAnim";

export default class PlayerLiengRenderer extends PlayerCardRenderer {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            betComponent: cc.Node,
            betCoinNode: cc.Node,
            actionNode: cc.Node,
            actionLabel: cc.Label,
            actionActor: cc.Node,
            chipPrefab: cc.Prefab,
            topBetPositionAnchor: cc.Node,
            bottomLeftBetPositionAnchor: cc.Node,
            rightBetPositionAnchor: cc.Node,
            leftBetPositionAnchor: cc.Node,
            bottomRightBetPositionAnchor: cc.Node,
            masterIcon: cc.Node,
            defaultCardAnchorBottomRight: cc.Node,
            defaultCardAnchorBottomLeft: cc.Node,
            toIcon: cc.Node,
            actionSprite: cc.Sprite,
            liengSkipSprite: cc.SpriteFrame,
            liengAllInSprite: cc.SpriteFrame,
            meSkipSprite: cc.SpriteFrame,
            meAllSprite: cc.SpriteFrame
        });
        
        /**
         * @type {cc.Animation}
         */
        this.actionNodeAnim = null
        this.betLabel = null
        this.gopGaIcon = null
    }

    _addGlobalListener() {
        super._addGlobalListener();
    }

    _removeGlobalListener() {
        super._removeGlobalListener();
    }

    onLoad(){
        super.onLoad()

        this.betLabel = this.betCoinNode.getComponentInChildren(cc.Label);
        
    }

    onEnable(...args){
        super.onEnable(...args);
        this.actionNodeAnim = this.actionNode.getComponent(cc.Animation);
        
        let player = this.data.actor
        let actionChangedPos = this._getCardAnchorPoint(player);
        if(actionChangedPos) {
            this._actionNodePos = actionChangedPos.getPosition()
            this.actionNode.setPosition(actionChangedPos.x, actionChangedPos.y)
            // this._actionNodePos = this.actionNode.getPosition()
        }
    }

    updatePlayerAnchor(anchorIndex){
        super.updatePlayerAnchor(anchorIndex);

        this._updatePlayerBetValueComponent();
    }

    _updatePlayerBetValueComponent(){

        let player = this.data.actor
        let anchor = null;
        
        if(player.isItMe()) {
            anchor = this.betComponent
        } else {
            anchor = this._getBetComponentPosByIndex(this.anchorIndex)
        }
        
        this.betComponent.setPosition(anchor.getPosition())
    }
    
    _getBetComponentPosByIndex(anchorIndex) {
        let anchor
        switch(anchorIndex) {
            case 2: {
                anchor = this.rightBetPositionAnchor
                break;
            }
            case 3: {
                anchor = this.bottomRightBetPositionAnchor
                break;
            }
            case 4: {
                anchor = this.bottomLeftBetPositionAnchor
                break;
            }
            case 5: {
                anchor = this.leftBetPositionAnchor
                break;
            }
            default: { // 1
                // anchor = this.topBetPositionAnchor
                anchor = this.betComponent
                break;
            }
        } 
        
        return anchor
    }
    
    _updateActorNodePosition() {
        let player = this.data.actor
        let anchor = null;
        
        if(player.isItMe()) {
            anchor = this.betComponent
        } else {
            anchor = this._getBetComponentPosByIndex(this.anchorIndex)
        }
        
        anchor = anchor.getPosition()
        let multiple = 1
        
        switch(this.anchorIndex) {
            case 1:
            case 3: {
                multiple = -1
                break;
            }
        }
        
        anchor.x = anchor.x + multiple * (this.actionNode.getContentSize().width / 2 - 14)
        anchor.y += 20
        this.actionNode.setPosition(cc.v2(anchor.x, anchor.y))
    }
    
            
    showBetAmount(amount){
        let formatted = GameUtils.formatBalanceShort(amount);
        this.betLabel.string = `${formatted}`;
    }

    revealAllCards(){
        this.cardList.cards.forEach(card => card.setReveal(true));
    }
    
    downAllCards(){
        this.cardList.cards.forEach(card => card.setReveal(false));
    }

    _getHandCardAlign(){
        let positionOnRight = this.scene.gamePlayers.playerPositions.isPositionOnRight(this.anchorIndex);
        return positionOnRight ? CardList.ALIGN_BOTTOM_RIGHT : CardList.ALIGN_BOTTOM_LEFT;
    }

    /**
     * @override
     * 
     * @param {any} player 
     * @returns 
     * @memberof PlayerLiengRenderer <- PlayerCardRenderer
     */
    _getCardAnchorPoint(player) {
        if(player && player.isItMe())
            return this.myCardAnchor;
        
        // let positionOnRight = player && this.isPositionOnRight(player.anchorIndex);
        // return positionOnRight ? this.defaultCardAnchor2 : this.defaultCardAnchor;
        let anchor = null;
        
        switch(this.anchorIndex) {
            case 2: {
                anchor = this.defaultCardAnchorBottomRight
                break;
            }
            case 3: {
                anchor = this.rightCardAnchor
                break;
            }
            case 4: {
                anchor = this.leftCardAnchor
                break;
            }
            case 5: {
                anchor = this.defaultCardAnchorBottomLeft
                break;
            }
            default: { // 1
                anchor = this.myCardAnchor
                break;
            }
        }
        
        return anchor;
    }

    /**
     * @param cardList
     * @param isItMe
     * @override
     */
    _initHandCardList(cardList, isItMe){
        super._initHandCardList(cardList, isItMe);
        if (isItMe) {
            cardList.setSpace(70);
            cardList.setMaxDimension(350);
            cardList.setDraggable(false);
            cardList.setSelectable(false);
            
            cardList.setRevealOnClick(false);
            cardList.setReveal(true);
        } else {
            cardList.setSpace(50);
            cardList.setMaxDimension(350);
        }

        cardList.setAlign(CardList.ALIGN_CENTER);
    }
    
    /**
     * 
     * 
     * @param {string} [text=''] 
     * @param {int} type 1: up bo, 2: tat tay
     * @memberof PlayerLiengRenderer
     */
    showAction(text = '', isAllIn){
        let ial = isAllIn
        
        if(!utils.isEmpty(text) && ial !== undefined)
            ial = undefined
        
        let player = this.data.actor
        
        this.actionSprite.spriteFrame = null
        
        if(ial !== undefined) {
            this.actionSprite.spriteFrame = player.isItMe() ? ial ? this.meAllSprite : this.meSkipSprite : ial ? this.liengAllInSprite : this.liengSkipSprite
            return
        }
        
        this.actionLabel.string = text;

        if(!utils.isEmpty(text)){
            this._updateActorNodePosition()
            utils.setVisible(this.actionActor, true);
        }
    }

    stopAllAnimation(){
        super.stopAllAnimation();
        this.actionNodeAnim && this.actionNodeAnim.stop();
    }

    /**
     * @override
     */
    clearCards(){
        if(this.scene.gameState != app.const.game.state.ENDING) {
            super.clearCards();
        }
    }
    
    playBetAnimation(betAmount){
        let coinChipAmount = this.scene.board.minBet > 0 ? Math.floor(betAmount / this.scene.board.minBet) : 1
        coinChipAmount = Math.min(coinChipAmount, 3)
        GameAnim.flyTo({fromNode: this.node, toNode: this.betCoinNode, amount: coinChipAmount, prefab: this.chipPrefab})
    }

    _reset(){
        super._reset();
        this.actionSprite.spriteFrame = null
        this.actionNode.setPosition(cc.v2(this._actionNodePos.x, this._actionNodePos.y))
        utils.setVisible(this.actionActor, false);
    }
    
    setVisibleTo(visible = false) {
        utils.setActive(this.toIcon, visible);
    }
    
    setVisibleMaster(visible = false) {
        utils.setActive(this.masterIcon, visible);
    }
    
    betComponentAppearance(show = true) {
        utils.setActive(this.betComponent, show)
    }

}

app.createComponent(PlayerLiengRenderer);