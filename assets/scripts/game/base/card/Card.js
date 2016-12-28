import app from 'app';
import Component from 'components';
import {utils, GameUtils} from 'utils';

export default class Card extends Component {

    constructor(byteValue) {
        super();

        this.properties = {
            ...this.properties,
            rankNode: cc.Label,
            suitNode: cc.Sprite,
            mainPic: cc.Sprite,
            cardBG: cc.Sprite,
            redTextColor: new cc.Color().fromHEX('#9A0000'),
            blackTextColor: new cc.Color().fromHEX('#242424'),
            texFrontBG: cc.SpriteFrame,
            texBackBG: cc.SpriteFrame,
            highlightNode: cc.Node,
            lockedNode: cc.Node,
            groupNode: cc.Node,
            groupNumberLabel: cc.Label,
            emptySprite: cc.SpriteFrame,

            texFaces: {
                default: [],
                type: cc.SpriteFrame
            },

            texSuitBig: {
                default: [],
                type: cc.SpriteFrame
            },

            texSuitSmall: {
                default: [],
                type: cc.SpriteFrame
            },
        }

        !utils.isNull(byteValue) && this.initFromByte(byteValue);
        this.selected = false;
        this.highlight = false;
        this.clickListener = null;
        this._selectedMargin = 40;
        this.reveal = true;
        this.group = -1;
        this.locked = false;
        this.__originalInfo = {};
    }

    setOriginalInfo(info = {}){
        this.__originalInfo = {...this.__originalInfo, ...info};
    }

    updateFinalPosition(){
        let position = this.__originalInfo.position;
        position && this.node.setPosition(position);
    }

    getFinalScale(){
        return this.__originalInfo.scale || this.node.scale;
    }

    getFinalPosition(){
        return this.__originalInfo.position || this.node.position;
    }

    finishCardAction(){
        this.node.stopAllActions();

        let {position, rotation, scale} = this.__originalInfo;

        position && this.node.setPosition(position);
        rotation && (this.node.rotation = rotation);
        scale && this.node.setScale(scale);
    }

    createActionFromOriginalInfo(duration){
        let actions = [];
        let {position, rotation, scale} = this.__originalInfo;

        if(position && (position != this.node.position)){
            actions.push(cc.moveTo(duration, position));
        }

        if(rotation && (rotation != this.node.rotation)){
        actions.push(cc.rotateTo(duration, rotation));
        }

        if(scale && (scale != this.node.scale)){
            actions.push(cc.scaleTo(duration, scale));
        }

        return actions.length > 0 ? cc.spawn(actions) : null;
    }

    setLocked(locked){
        if(!this.loaded){
            this.__locked = locked;
            return;
        }
        this.locked = locked;
        utils.setVisible(this.lockedNode, locked);
    }

    setGroup(group){
        this.group = group;
        if(group > 0){
            this.groupNumberLabel && (this.groupNumberLabel.string = group);
            utils.active(this.groupNode, 255);
        }else{
            utils.deactive(this.groupNode, 0);
        }
    }

    isEmpty(){
        return this.byteValue < 5;
    }

    setHighlight(highlight) {
        if(!this.loaded){
            this.__highlight = highlight;
            return;
        }

        this.highlight = highlight;
        utils.setVisible(this.highlightNode, highlight);
    }

    initFromByte(...args) {
        let rank, suit, byteValue;

        if (args.length == 1) {
            byteValue = args[0];
            rank = byteValue >> 2;
            suit = byteValue & 0x03;
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

        this.rankNode.string = this._getRankName();
        this.suitNode.spriteFrame = this.texSuitSmall[this.suit] || this.emptyNode;
        this.rankNode.node.color = this.isRedSuit() ? this.redTextColor : this.blackTextColor;
        //this.rank > 10 => isFaceCard
        this.mainPic.spriteFrame = this.rank > 10 ? this.texFaces[this.rank - 10 - 1] : this.texSuitBig[this.suit] || this.emptySprite;

    }

    onEnable(){
        super.onEnable();

        utils.setVisible(this.lockedNode, this.locked);
        utils.setVisible(this.highlightNode, this.highlight);

        this.loaded = true;

        if(this.__locked){
            this.setLocked(this.__locked);
        }

        if(this.__highlight){
            this.setLocked(this.__highlight);
        }

        this.setReveal(this.reveal);
    }

    onActive(){
        super.onActive();
    }

    _getRankName() {
        switch (this.rank) {
            case Card.RANK_J:
                return 'J';
            case Card.RANK_Q:
                return 'Q';
            case Card.RANK_K:
                return 'K';
            case Card.RANK_AT:
            case Card.RANK_ACE:
                return 'A';
            default:
                return '' + this.rank;
        }
    }

    setSelected(selected, runAction = true){
        if(this.selected == selected) return;

        this.selected = selected;

        if(runAction){
            this.node.runAction(cc.moveTo(0.2, this.node.x, selected ? this._selectedMargin : 0));
        }else {
            this.node.setPositionY(selected ? this._selectedMargin : 0);
        }
    }

    isRedSuit() {
        return this.suit === Card.SUIT_ZO || this.suit === Card.SUIT_CO;
    }

    setReveal(isFaceUp) {
        this.reveal = isFaceUp;
        this.rankNode.node.active = isFaceUp;
        this.suitNode.node.active = isFaceUp;
        this.mainPic.node.active = isFaceUp;
        this.cardBG.spriteFrame = isFaceUp ? this.texFrontBG : this.texBackBG;
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
        return rank << 2 | suit & 0x03;
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
            }
            else {
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

    value(){
        return this.byteValue;
    }

    static compareRank(card1, card2){
        return card1.rank - card2.rank;
    }

    static compareSuit(card1, card2){
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
Card.CARD_WIDTH = 75;
Card.CARD_HEIGHT = 100;
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
