import app from 'app';
import ActionComponent from 'ActionComponent';
import utils from 'utils';
import GameUtils from 'GameUtils';
import CCUtils from 'CCUtils';

export default class Card extends ActionComponent {

    constructor(byteValue) {
        super();

         this.properties = {
            cardsAtlas: {
                default : null,
                type : cc.SpriteAtlas
            },
            bodyNode: cc.Node,
            cardBG: cc.Sprite,
            highlightNode: cc.Node,
            disableNode: cc.Node,
            lockedNode: cc.Node,
            tapHighlightNode: cc.Node,
            groupNode: cc.Node,
            groupNumberLabel: cc.Label,
            emptySprite: cc.SpriteFrame,
            // cardSpriteFrame : cc.SpriteFrame,
            texBackBG: cc.SpriteFrame,
            disableCard: false
        }

        byteValue != null && byteValue != undefined && this.initFromByte(byteValue);
        this.selected = false;
        this.highlight = false;
        this.clickListener = null;
        this._selectedMargin = 40;
        this.reveal = true;
        this.group = -1;
        this.locked = false;
        this.__originalInfo = {};
        this.__enableScaleOnClick = false;
    }

    setEnableScaleOnClick(enable){
        if(this.isComponentEnabled()){
            let button = this.node.getComponent(cc.Button);
            if(button){
                if(enable){
                    button.transition = cc.Button.Transition.SCALE
                    button.zoomScale = 1.15;
                    button.duration = 0.08;
                }else{
                    button.transition = cc.Button.Transition.NONE
                    // this.finishCardAction()
                }
            }
        }else{
            this.__enableScaleOnClick = enable;
        }
    }

    onAnchorPointChanged(){
        let anchorPoint = this.node.getAnchorPoint()
        this.bodyNode.setAnchorPoint(anchorPoint)
        this.tapHighlightNode && this.tapHighlightNode.children.forEach(child => child.setAnchorPoint(anchorPoint.x, 0));
    }

    setVisibleTapHighlightNode(visible, onClickIfVisible){
        CCUtils.setVisible(this.tapHighlightNode, visible);
        CCUtils.setVisible(this.highlightNode, visible);

        if(visible){
            this.setOnClickListener(onClickIfVisible)
        }else{
            this.setOnClickListener(null)
        }

        let animationComponent = this.tapHighlightNode && this.tapHighlightNode.getComponent(cc.Animation);
        animationComponent && (visible ? animationComponent.play() : animationComponent.stop())
        this.setEnableScaleOnClick(visible)
    }

    setDisableCard(disable){
        if (!this.loaded) {
            this.__disable = disable;
            return;
        }

        this.disableCard = disable;
        utils.setVisible(this.disableNode, disable);
    }

    setOriginalInfo(info = {}) {
        this.__originalInfo = Object.assign({}, this.__originalInfo, info);
    }

    updateFinalPosition() {
        let position = this.__originalInfo.position;
        position && this.node.setPosition(position);
    }

    getFinalScale() {
        return this.__originalInfo.scale || this.node.scale;
    }

    getFinalPosition() {
        return this.__originalInfo.position || this.node.position;
    }

    finishCardAction() {
        if(this.node){
            this.node.stopAllActions();

            let { position, rotation, scale } = this.__originalInfo;

            position && this.node.setPosition(position);
            rotation && (this.node.rotation = rotation);
            scale && this.node.setScale(scale);
        }
    }

    createActionFromOriginalInfo(duration) {
        let actions = [];
        let { position, rotation, scale } = this.__originalInfo;

        // log("__originalInfo: ", this.__originalInfo)

        if (position && (position != this.node.position)) {
            actions.push(cc.moveTo(duration, position.x, position.y));
        }

        if (rotation && (rotation != this.node.rotation)) {
            actions.push(cc.rotateTo(duration, rotation));
        }

        if (scale && (scale != this.node.scale)) {
            actions.push(cc.scaleTo(duration, scale));
        }

        return actions.length > 0 ? cc.sequence(cc.spawn(actions), cc.callFunc(this.updateFinalPosition, this)) : null;
    }

    setLocked(locked) {
        this.__locked = locked;

        if (!this.loaded) {
            return;
        }

        this.locked = locked;
        utils.setVisible(this.lockedNode, locked);
    }

    setGroup(group) {
        this.group = group;
        if (group > 0) {
            this.groupNumberLabel && (this.groupNumberLabel.string = group);
            utils.active(this.groupNode, 255);
        } else {
            utils.deactive(this.groupNode, 0);
        }
    }

    isEmpty() {
        return this.byteValue < 4;
    }

    setHighlight(highlight) {
        this.__highlight = highlight;
        if (!this.loaded) {
            return;
        }

        this.highlight = highlight;
        utils.setVisible(this.highlightNode, highlight);
    }

    initFromByte(...args) {
        let rank, suit, byteValue;

        if (args.length == 1) {
            byteValue = args[0];
            rank = (byteValue >> 2)
            suit = (byteValue & 0x03)
        } else if (args.length == 2) {
            rank = args[0];
            suit = args[1];
            byteValue = Card.toByte(rank, suit);
        }

        this._init(rank, suit, byteValue);
    }

    _init(rank, suit, byteValue) {
        this.rank = rank;
        this.suit = suit;
        this.byteValue = byteValue;
    }

    onLoad() {
        const cardSpriteName = `card_${this._getRankName()}_${this._getSuitName()}`;
        // console.warn(`cardSpriteName ${cardSpriteName}`);
        // console.warn(`cardsAtlas ${this.cardsAtlas}`);
        this.cardSpriteFrame = this.cardsAtlas.getSpriteFrame(cardSpriteName);
        this.cardBG.spriteFrame = this.cardSpriteFrame;
        this.texBackBG = this.cardsAtlas.getSpriteFrame('cards_back')
    }

    onEnable() {
        super.onEnable();
        // this.cardSpriteFrame && this.cardSpriteFrame.getTexture().setTexParameters(gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

        utils.setVisible(this.lockedNode, this.locked);
        utils.setVisible(this.highlightNode, this.highlight);

        this.loaded = true;
        
        if (this.__locked) {
            this.setLocked(this.__locked);
        }

        if (this.__highlight) {
            this.setHighlight(this.__highlight);
        }

        if (this.__disable) {
            this.setDisableCard(this.__disable);
        }

        if(this.__enableScaleOnClick != undefined){
            this.setEnableScaleOnClick(this.__enableScaleOnClick)
            this.__enableScaleOnClick = undefined;
        }
        this.setReveal(this.reveal);
    }

    onDestroy() {
        super.onDestroy();
        this._clickListener = null;
    }

    _getRankName() {
        switch (this.rank) {
            case Card.RANK_J:
                return 'j';
            case Card.RANK_Q:
                return 'q';
            case Card.RANK_K:
                return 'k';
            case Card.RANK_AT:
            case Card.RANK_ACE:
                return 'a';
            default:
                return '' + this.rank;
        }
    }
    _getSuitName() {
        switch (this.suit) {
            case Card.SUIT_BICH:
                return 'bich';
            case Card.SUIT_TEP:
                return 'tep';
            case Card.SUIT_ZO:
                return 'ro';
            case Card.SUIT_CO:
                return 'co';
            default:
                return 'bich';
        }
    }

    setSelected(selected, runAction = true, forceUpdate = false) {
        if (this.selected == selected && !forceUpdate) return;


        if(forceUpdate && this.selected == selected){
            this.finishCardAction()
        }else{
            this.node && this.node.stopAllActions();
        }

        this.selected = selected;

        if (runAction) {
            this.node && this.node.runAction(cc.moveTo(0.2, this.node.x, selected ? this._selectedMargin : 0));
        } else {
            this.node && this.node.setPositionY(selected ? this._selectedMargin : 0);
        }
    }

    isRedSuit() {
        return this.suit === Card.SUIT_ZO || this.suit === Card.SUIT_CO;
    }

    setReveal(isFaceUp) {
        this.reveal = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.cardSpriteFrame : this.texBackBG ? this.texBackBG : this.cardsAtlas.getSpriteFrame('cards_back');
    }

    setOnClickListener(cb) {
        this._clickListener = cb;
    }

    onClick() {
        this._clickListener && this._clickListener(this);
    }

    equals(card) {
        return this.byteValue == card.byteValue;
    }

    static toByte(rank, suit) {
        return (rank << 2) | (suit & 0x03);
    }

    /**
     *
     *
     * @param card
     * @param gameType
     * @param compareType: true: Compare rank first, otherwise: Compare suit first
     * @returns {number}
     */
    compareTo(card, gameType, compareType = true) {

        if (card) {
            let thisRank = GameUtils.getRank(this, gameType);
            let compareRank = GameUtils.getRank(card, gameType);
            let thisSuit = GameUtils.getSuit(this, gameType);
            let compareSuit = GameUtils.getSuit(card, gameType);

            if (compareType) {
                return thisRank == compareRank ? (thisSuit - compareSuit) : (thisRank - compareRank);
            } else {
                return thisSuit == compareSuit ? (thisRank - compareRank) : (thisSuit - compareSuit);
            }
        }
    }

    isHeo() {
        return this.rank === 2 || this.rank === 15;
    }

    isBa() {
        return this.rank === 3;
    }

    isAt() {
        return this.rank === 1 || this.rank === 14;
    }

    getRank(gameType) {
        return this.rank;
    }

    static from(...args) {
        let card = new Card();

        if (args.length == 1) {
            card.initFromByte(args[0]);
        } else if (args.length == 2) {
            card.initFromByte(Card.toByte(args[0], args[1]));
        }

        return card;
    }

    value() {
        return this.byteValue;
    }

    static compareRank(card1, card2) {
        return card1.rank - card2.rank;
    }

    static compareSuit(card1, card2) {
        return card1.suit - card2.suit;
    }
}

Card.RANK_AT = 1;
Card.RANK_HAI = 2;
Card.RANK_BA = 3;
Card.RANK_BON = 4;
Card.RANK_NAM = 5;
Card.RANK_SAU = 6;
Card.RANK_BAY = 7;
Card.RANK_TAM = 8;
Card.RANK_CHIN = 9;
Card.RANK_MUOI = 10;
Card.RANK_J = 11;
Card.RANK_Q = 12;
Card.RANK_K = 13;
Card.RANK_ACE = 14;
Card.RANK_DEUCE = 15;

Card.SUIT_BICH = 0;
Card.SUIT_TEP = 1;
Card.SUIT_ZO = 2;
Card.SUIT_CO = 3;

Card.STATE_TO_MOVE = +1;
Card.STATE_ON_HAND = 0;
Card.STATE_TO_PUSH = -1;

Card.MOVEUP_CARD_DURATION = 0.08;
/**/
Card.FOCUS_OVER_INDEX = 0;
Card.SELECT_OVER_INDEX = 1;
Card.EAT_INDEX = 2;
/**/
Card.FIRST_CARD_GROUP = 0;
Card.SECOND_CARD_GROUP = 1;
Card.THIRD_CARD_GROUP = 2;
Card.VERTICAL_SPACE_TO_SECOND_POSITION_Y = 24;
/**/
Card.CARD_WIDTH = 126;
Card.CARD_HEIGHT = 156;
Card.CARD_SHADOW_LEFT_WIDTH = 2;
Card.CARD_SHADOW_RIGHT_WIDTH = 1;
Card.CARD_KNOW_LEFT = 13;
Card.CARD_KNOW_RIGHT = 58;
Card.CARD_KNOW_TOP = 13;
Card.CARD_KNOW_BOTTOM = 80;
Card.HAND_LEFT_MARGIN_RIGHT = 18;
Card.HAND_LEFT_MARGIN_BOTTOM = 50;
Card.HAND_RIGHT_MARGIN_LEFT = 17;
Card.HAND_RIGHT_MARGIN_BOTTOM = 30;

app.createComponent(Card);