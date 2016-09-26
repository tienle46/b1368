import app from 'app';
import Component from 'Component';
import Card from 'Card';
var _ = require('lodash');


export default class CardList extends Component {

    static get VERTICAL() { return 1; }
    static get HORIZONTAL() { return 2; }

    static get WIDTH() { return 800; }
    static get HEIGHT() { return 150; }

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

        this.cards = [];
        this.selectedCards = [];
        this.cardWidth = 0;
        this._type = CardList.HORIZONTAL;
        this._direction = CardList.LEFT_TO_RIGHT;
        this._layout = {
            default: null,
            type: cc.Layout
        }
        this.draggable = true;
        this.listWidth = 0;
        this.listHeight = 60;

        this._cardListRotate = 0; //TODO
        this._cardRotate = 0; //TODO

        this._rightAlign = false;
    }

    _init({x = this.node.x, y = this.node.y, type = this._type} = {}){

        this.setPosition(x, y);
        this.setType(type);

        this._onConfigChanged();
    }

    getSelectedCards(){
        return this.selectedCards;
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
        this._test();

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

    /**
     *
     * @param cards
     * @param animation
     */
    removeCards(cards,animation){
        cards = cards instanceof Card ? [cards] : cards;
        cards && cards.forEach(card => {
            this.node.removeChild(card.node);
        });

        _.pullAll(this.cards, cards);
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
            _.pullAll(this.selectedCards, [card]);
        }else {
            this._raiseCards([card]);
            this.selectedCards.push(card);
        }

        card.selected = !card.selected;
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

    /**
     * Fill cards vào holder area
     * @param cards: Danh sách card được fill vào area
     * @param faceDown: Sau khi sắp xếp vào card holder, hiển thị face up hay facedown
     * @param animation: Animation được thực thi khi fill card
     */
    _fillCards (cards, faceDown, animation){

        this._verifyLayoutInitiated();

        const maxDimension = this.listWidth;
        const numberOfCards = this.cards.length + cards.length;
        let spacing = 0;

        const scaleFactor = this.listHeight / CardList.CARD_HEIGHT;

        const wth = maxDimension / scaleFactor;
        if(numberOfCards * CardList.CARD_WIDTH > wth){
            spacing = (wth - numberOfCards * CardList.CARD_WIDTH) / numberOfCards - 1;
            spacing = spacing || 0;

            this._layout.spacingX = spacing
        }

        if(this._rightAlign){
            cards.reverse();
        }

        cards.forEach((card, index) => {

            let newCard = cc.instantiate(this.cardPrefab).getComponent('Card');

            newCard.initFromByte(card.byteValue);
            newCard.reveal(true);
            newCard.setOnClickListener(this._onSelectCard.bind(this));

            this.node.addChild(newCard.node, index, index + 1000);

            newCard.node.on(cc.Node.EventType.TOUCH_START, (event) => {

                // //TODO
                // if(!this.draggable) return;
                // console.log(`touch start position ${event.getLocation().x}`);
                //
                // this.node.getComponent(cc.Layout).type = CardList.NONE;

            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {

                if(!this.draggable) return;

                console.log(`touch start position ${event.getLocation().x}`);

                let target = event.target;
                target.x += event.getDelta().x;

               console.log(`moving distance ${event.getDelta().x}`);



            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_END, (event) => {

                // if(this.draggable) return;
                //
                // this.node.getComponent(cc.Layout).type = CardList.HORIZONTAL;

            }, this);

            this.cards.push(newCard);

        });

         /**
          *  TAG = FIX 
          *  Func nay call khi anchor change hoặc add mới card
          *  NOTE: Có thể tối ưu chỉ set lại anchor point của card mới 
          */
         this.cards.forEach(card => {
           card.node.setAnchorPoint(this.node.getAnchorPoint());
         });
    }

    _verifyLayoutInitiated(){
        if(!this._layout) {
            this._layout = this.node.addComponent(cc.Layout);
            this._layout.type = cc.Layout.Type.HORIZONTAL;

            this._layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            this.node.on('anchor-changed', ()=>{
                this.node.children.forEach((child)=>{
                    child.setAnchorPoint(this.node.getAnchorPoint());
                })
            });
            this.node.setScale(this.listHeight / CardList.CARD_HEIGHT, this.listHeight /  CardList.CARD_HEIGHT);
            this._onConfigChanged();
        }
    }
    _test(){
        console.log("test");

        let cards = [7,11,15,19,23,27,31,35,39,43,47,51,55].map(value => Card.from(value));
        this.setCards(cards);

    }
    alignToParent(relation, marginX, marginY){
        // TOP_LEFT : 1,
        // TOP_CENTER : 2,
        // TOP_RIGHT : 3,
        // CENTER_LEFT : 4,
        // CENTER_CENTER : 5,
        // CENTER_RIGHT : 6,
        // BOTTOM_LEFT : 7,
        // BOTTOM_CENTER : 8,
        // BOTTOM_RIGHT: 9

        switch(relation){
            case CardList.RELATION.TOP_LEFT:
                this._rightAlign = true;
                this.setPosition(- marginX,0);
                this.node.setAnchorPoint(1,0);

                break;

            case CardList.RELATION.CENTER_RIGHT:
                this._rightAlign = false;
                this.setPosition( marginX,0);

                this.node.setAnchorPoint(0,0.5);
                if(this._type == CardList.VERTICAL){

                    this.node.setAnchorPoint(0.5,0.5);
                }


                break;

            case CardList.RELATION.BOTTOM_CENTER:
                this._rightAlign = false;
                this.setPosition( 0,-marginY);
                this.node.setAnchorPoint(0.5 , 1);
                break;

            default: break;
        }
    }

}

app.createComponent(CardList);
