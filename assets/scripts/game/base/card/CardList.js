import app from 'app';
import Component from 'Component';
import Card from 'Card';
var _ = require('lodash');


export default class CardList extends Component {

    static get VERTICAL() { return 1; }
    static get HORIZONTAL() { return 2; }

    static get WIDTH() { return 800; }
    static get HEIGHT() { return 130; }

    static get CARD_WIDTH() { return 100; }
    static get CARD_HEIGHT() { return 130; }

    static get RELATION () {
        return {
            TOP_LEFT : 1,
            TOP_CENTER : 2,
            TOP_RIGHT : 3,
            CENTER_LEFT : 4,
            CENTER_CENTER : 5,
            CENTER_RIGHT : 6,
            BOTTOM_LEFT : 7,
            BOTTOM_CENTER : 8,
            BOTTOM_RIGHT: 9
        }
    }

    constructor() {
        super();

        this.cardPrefab = {
            default: null,
            type: cc.Prefab
        };

        this.cardWidth = 0;
        this._type = CardList.HORIZONTAL;
        this._layout = {
            default: null,
            type: cc.Layout
        }
        this.draggable = false;
        this.listWidth = 0;
        this.listHeight = CardList.HEIGHT;

        this._cardListRotate = 0; //TODO
        this._cardRotate = 0; //TODO

        this._rightAlign = false;
        this.scaleFactor;
        this.cardSpacing = 0;
        this.cards = null;
        this.selected = false;
    }

    getRawCards(){
        return this.cards.filter(card => {return Card.from(card.byteValue)});
    }

    _init({x = this.node.x, y = this.node.y, type = this._type} = {}){

        this.setPosition(x, y);
        this.setType(type);

        this._onConfigChanged();
        this.cards = this.cards || [];
    }

    getSelectedCards(){
        return this.cards.filter(card=> card.selected);
    }

    setType(type = CardList.HORIZONTAL){
        this._type = type;
    }

    setDraggable(draggable){
        this.draggable = draggable;
    }

    onLoad () {
        // this._verifyLayoutInitiated();
        this._init();
        // this._test();

        if(this._type == CardList.VERTICAL){
            this.node.runAction(cc.rotateBy(0, 90));
        }
    }

    setPosition(x = 0, y = 0){
        this.node.x = x;
        this.node.y = y;
    }

    setCards (cards, faceDown, animation){
        this.clear();
        this._fillCards(cards, faceDown, animation);
    }

    clear(){
        this.cards = [];
        this.node.removeAllChildren(true);
    }

    /**
     *
     * @param {Card, [Card]}cards
     * @param faceDown
     * @param animation
     */
    addCards(cards, faceDown, animation){
        cards = cards instanceof Card ? [cards] : cards;
        this._fillCards(cards, faceDown, animation);
    }

    findCardComponents(cardModels = []){
        if(cardModels.length == 0) return []

        let filteredCards = this.cards.filter(card => {
            for(let cardModel of cardModels){
                if(card.equals(cardModel)){
                    return true;
                }
            }
        });

        return filteredCards;
    }

    /**
     *
     * @param cards
     * @param animation
     */
    removeCards(cards, animation){
        cards = cards instanceof Card ? [cards] : cards;

        let cardComponents = this.findCardComponents(cards);
        cardComponents && cardComponents.forEach(card => {
            this.node.removeChild(card.node);
        });

        _.pullAll(this.cards, cardComponents);
        // _.pullAll(this.selectedCards, cardComponents);
    }

    _removeSingleCard(removingCard){
        this.cards.some((card, index) => {
            if(card.byteValue == removingCard.byteValue){
                this.cards.splice(index, 1);
                return true;//break;
            }
        });
    }
    /**
     * Rút một quân bài từ lọc vào bài trên tay của Player
     * @param card
     * @param faceDown
     * @param animation
     */
    drawCard (card, faceDown, animation){
        this._fillCards([card], faceDown,animation);
    }

    _onConfigChanged(){

        this._verifyLayoutInitiated();

    }

    /**
     * Clicked a card
     * @param card
     */
    _onSelectCard(card){

        if(card.selected){
            this._lowerCards([card]);
            card.selected = false;
        }else {
            this._raiseCards([card]);
            card.selected = true;
        }
    }

    _setMaxWidth(width = CardList.WIDTH){
        this.listWidth = width;
    }

    _setMaxHeight(height = CardList.HEIGHT){
        this.listHeight = height;
    }

    /**
     * Do not reset anchor point right now
     * @private
     */
    _onDirectionChanged(){
        // let anchor = this.node.getAnchorPoint();
        //TODO
    }

    /**
     * Khi Player lựa chọn quân bài, thực hiện nâng quân bài cao hơn so với các quân bài bình thường
     * @param cards
     */
    _raiseCards (cards){
        this._moveCards(cards,0,50);
    }

    _lowerCards (cards){
        this._moveCards(cards,0,-50);
    }

    _moveCards (cards, deltaX, deltaY){
        var nodeAction = cc.moveBy(0.1, deltaX, deltaY);
        for (let card of cards) {
            card.node.runAction(nodeAction);
        }
    }

    _updateCardSpacing(){
        const maxDimension = this.listWidth;
        const numberOfCards = this.cards.length;
        let spacing = 0;

        const wth = maxDimension / this.scaleFactor;
        if(numberOfCards * CardList.CARD_WIDTH > wth){
            spacing = (wth - numberOfCards * CardList.CARD_WIDTH) / (numberOfCards - 1);
            spacing = spacing || 0;

            this.cardSpacing = spacing;
            this._layout.spacingX = this.cardSpacing;
        }
    }

    /**
     * Fill cards vào holder area
     * @param cards: Danh sách card được fill vào area
     * @param faceDown: Sau khi sắp xếp vào card holder, hiển thị face up hay facedown
     * @param animation: Animation được thực thi khi fill card
     */
    _fillCards (cards, faceDown, animation){

        this._verifyLayoutInitiated();

        if(this._rightAlign){
            cards.reverse();
        }

        cards.forEach((card, index) => {
            this.cards.push(newCard);

            let newCard = cc.instantiate(this.cardPrefab).getComponent('Card');

            newCard.initFromByte(card.byteValue);
            newCard.reveal(true);
            newCard.setOnClickListener(this._onSelectCard.bind(this));
            newCard.node.tag = index + 1000;
            this.node.addChild(newCard.node);

            newCard.node.on(cc.Node.EventType.TOUCH_START, (event) => {

                if(!this.draggable) return;
                console.log(`touch start position ${event.getLocation().x}`);
                this._layout.type = cc.Layout.Type.NONE;

            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {

                if(!this.draggable) return;

                let target = event.target;
                target.x += event.getDelta().x;
                let direction = event.getDelta().x > 0 ? 1 : -1;

                //position of nth card within list calculated by
                // x = CARD_WIDTH * n + (n-1)* spacing
                // x = (CARD_WIDTH + spacing) * n - spacing
                // n = (x + spacing) /(CARD_WIDTH + spacing)

                let adjacentIndex = Math.trunc( (target.x + this._layout.spacingX) / (CardList.CARD_WIDTH + spacing));
                // console.log(`adjacentIndex ${adjacentIndex}`);
                if(adjacentIndex != (target.tag - 1000)){

                    let beingSwapNode = this.node.getChildByTag(adjacentIndex + 1000);

                    beingSwapNode.x = CardList.CARD_WIDTH * (adjacentIndex - direction) + (adjacentIndex - direction -1)* spacing;

                    let tmp = beingSwapNode.tag;
                    beingSwapNode.tag = target.tag;
                    target.tag = tmp;

                    beingSwapNode.zIndex = beingSwapNode.tag;
                    target.zIndex = target.tag;

                    this.node.children[tmp - 1000] = target;
                    this.node.children[beingSwapNode.tag - 1000] = beingSwapNode;
                }
            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_END, (event) => {
                if(!this.draggable) return;
                this._layout.type = cc.Layout.Type.HORIZONTAL;
                console.log('card move finished');

            }, this);


        });

    }

    _verifyLayoutInitiated(){
        if(!this._layout) {
            this._layout = this.node.addComponent(cc.Layout);
            this._layout.type = cc.Layout.Type.HORIZONTAL;
            this._layout.direction = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;
            this._layout.spacingY = 0;
            this._layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

            this.node.on('child-added', (event)=>{
                event.detail.setAnchorPoint(event.detail.parent.getAnchorPoint());
                this._updateCardSpacing();
            });

            this.scaleFactor  = this.listHeight / CardList.CARD_HEIGHT;
            this.node.setScale(this.scaleFactor, this.scaleFactor);
            this._onConfigChanged();

            console.debug("this.scaleFactor: ", this.scaleFactor)
        }
    }
    _test(){
        console.log("test");

        let cards = [7,11,15,19,23,27,31,35,39,43,47,51,55].map(value => Card.from(value));
        this.setCards(cards);

    }

    _onAnchorChanged(){
        const anchorPoint = this.node.getAnchorPoint();
        this.node.children.forEach(node => {
            node.setAnchorPoint(anchorPoint);
        })
    }

    setAnchorPoint(x, y){
        this.node.setAnchorPoint(x, y);
        this._rightAlign = y == 1;

    }

    _createNewCard(byteValue, reveal){
        let newCard = cc.instantiate(this.cardPrefab).getComponent('Card');

        newCard.initFromByte(byteValue);
        newCard.reveal(reveal);
        newCard.setOnClickListener(this._onSelectCard.bind(this));

        return newCard;
    }

    _getAppendXLocation(){
        const maxDimension = this.listWidth;
        const numberOfCards = this.cards.length;
        let spacing = 0;

        const wth = maxDimension / this.scaleFactor;
        if(numberOfCards * CardList.CARD_WIDTH > wth){
            return this.listWidth;
        }
        else{
            return CardList.CARD_WIDTH * this.scaleFactor * this.cards.length;
        }
    }

    /**
     * Move cards sang card list khac voi animation
     * @param cards
     * @param destinationList
     * @param animation
     */
    transferCards(cards, destinationList, animation){

        let destCardListNode = destinationList instanceof cc.Node ? destinationList : destinationList.node;

        const cardListComponent = destCardListNode.getComponent('CardList');
        //get last child of destination list position
        let destinationPoint = cc.p(0,0);
        if(destCardListNode.childrenCount > 0){
            const lastChild = destCardListNode.children[destCardListNode.childrenCount - 1 ];
            destinationPoint = lastChild.getPosition();
            destinationPoint.x -= cardListComponent._layout.spacingX;
        }

        cardListComponent._layout.type = cc.Layout.Type.NONE;

        let cardComponents = this.findCardComponents(cards);

        let actions = [];

        // let tmp = this.cards.slice(0,1);
        cardComponents.forEach((card, index) => {

            const p = card.node.parent.convertToWorldSpaceAR(card.node.getPosition());
            const localPoint = destCardListNode.convertToNodeSpaceAR(p);

            //Remove from src
            card.node.removeFromParent(true);
            this._removeSingleCard(card);

            //Add to des
            const newCard = this._createNewCard(card.byteValue,true);
            destCardListNode.addChild(newCard.node);
            newCard.node.setPosition(localPoint);
            //
            if(index < cards.length - 2){

                actions.push(cc.callFunc(()=>{
                    newCard.node.runAction(cc.moveTo(1,destinationPoint.x,destinationPoint.y));
                }));

            }
            else{
                actions.push(cc.callFunc(()=>{
                    newCard.node.runAction(cc.sequence(cc.moveTo(0.5,destinationPoint.x,destinationPoint.y), cc.callFunc(()=>{
                        cardListComponent._layout.type = cc.Layout.Type.HORIZONTAL;
                    })))
                }))

            }
            destinationPoint.x -= cardListComponent._layout.spacingX;
            cardListComponent.cards.push(newCard);
        });

        destinationList.runAction(cc.sequence(actions));
    };

    dealCards(cardBytes){
        this._layout.type = cc.Layout.Type.NONE;
        let timeToElapse = 0.5;

        let actions = [];
        cardBytes.forEach((byte,index) =>{
            const deltaX = this._getAppendXLocation();
            const newCard = this._createNewCard(byte,true);
            this.cards.push(newCard);

            let centerDeckPosition = this.node.convertToNodeSpaceAR(cc.p(480,320));
            newCard.node.setPosition(centerDeckPosition);
            this.node.addChild(newCard.node);

            if(index < cardBytes.length - 1){
                actions.push(cc.callFunc(()=>{
                    newCard.node.active = true;

                    newCard.node.runAction(cc.spawn(cc.moveTo(timeToElapse,cc.p(deltaX,0))));
                }));
                actions.push(cc.delayTime(0.1));
            }
            else{
                actions.push(cc.callFunc(()=>{
                    newCard.node.runAction(cc.sequence(
                        cc.spawn(cc.moveTo(timeToElapse,cc.p(deltaX,0))),
                        cc.callFunc(()=>{this._layout.type = cc.Layout.Type.HORIZONTAL;})));
                }));
            }

        });

        this.node.runAction(cc.sequence(actions));
    }
}

app.createComponent(CardList);
