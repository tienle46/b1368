import app from 'app'
import Component from 'Component'
import Card from 'Card'
var _ = require('lodash');


export default class CardList extends Component {

    static get VERTICAL() { return cc.Layout.Type.VERTICAL };
    static get HORIZONTAL() { return cc.Layout.Type.HORIZONTAL };
    static get LEFT_TO_RIGHT() { return cc.Layout.HorizontalDirection.LEFT_TO_RIGHT };
    static get RIGHT_TO_LEFT() { return cc.Layout.HorizontalDirection.RIGHT_TO_LEFT };
    static get TOP_TO_BOTTOM() { return cc.Layout.HorizontalDirection.LEFT_TO_RIGHT };
    static get BOTTOM_TO_TOP() { return cc.Layout.HorizontalDirection.RIGHT_TO_LEFT };
    static get WIDTH() { return 800 };
    static get HEIGHT() { return 150 };

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
        this._layout = cc.Layout;
        this.draggable = false;

        this._cardListRotate = 0; //TODO
        this._cardRotate = 0; //TODO
    }

    _init({x = this.node.x, y = this.node.y, width = this.node.width, height = this.node.height, type = this._type, direction = this._direction} = {}){
        this._setMaxWidth(width);
        this._setMaxHeight(height);
        this.setPosition(x, y);
        this.setType(type);
        this.setDirection(direction);

        this._onConfigChanged();
    }

    getSelectedCards(){
        return this.selectedCards;
    }

    setType(type = CardList.HORIZONTAL){
        this._type = type;
    }

    setDirection(direction = CardList.LEFT_TO_RIGHT){
        this._direction = direction;
        this._onDirectionChanged();
    }

    setSpacing(spacing){
        if(this._type === CardList.HORIZONTAL){
            this._layout.horizontalDirection = this._direction;
            this._layout.spacingX = spacing;
        }
        else if (this._type === CardList.VERTICAL){
            this._layout.verticalDirection = this.direction;
            this._layout.spacingY = spacing;
        }
    }

    setDraggable(draggable){
        this.draggable = draggable;
    }


    onLoad () {
	this._verifyLayoutInitiated();
        // this._test();
    }

    setPosition(x = 0, y = 0){
        this.node.x = x;
        this.node.y = y;
    }

    setMaxSize({width = CardList.WIDTH, height = CardList.HEIGHT} = {}){
        if(this._type == CardList.HORIZONTAL){
            this._setMaxWidth(width);
        }

        if(this._type == CardList.VERTICAL){
            this._setMaxHeight(height);
        }

        this._onConfigChanged();
    }

    _test(){
        console.log("test")
        this._init();

        this.setPosition(17, 100);
        let cards = [39,35,11,21,24,14,33].map(value => Card.from(value));
        this.setCards(cards);

        // this.node.runAction(cc.rotateBy(0,90));
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
        cards = cards instanceof Card ? [cards] : cards
        this._fillCards(cards, faceDown, animation);
    }

    /**
     *
     * @param cards
     * @param animation
     */
    removeCards(cards,animation){
        cards = cards instanceof Card ? [cards] : cards
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

        this._layout.type = this._type;
        this._layout.resizeMode = cc.Layout.ResizeMode.NONE;

        this.cardWidth = 100 * this.node.height / 130;
        let numberOfCards = this.cards.length;
        let spacing = 0;
        if (numberOfCards * this.cardWidth > this.node.width){
            spacing = - (numberOfCards * this.cardWidth - this.node.width) / (numberOfCards - 1);
        }

        this.setSpacing(spacing);
    }

    /**
     * Clicked a card
     * @param card
     */
    _onSelectCard(card){

        if(card.selected){
            this._lowerCards([card])
            _.pullAll(this.selectedCards, [card]);
        }else {
            this._raiseCards([card])
            this.selectedCards.push(card);
        }

        card.selected = !card.selected;
    }

    _setMaxWidth(width = CardList.WIDTH){
        this.node.width = width;
    }

    _setMaxHeight(height = CardList.HEIGHT){
        this.node.height = height;
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

        const parentHeight = this.node.height;
        const scaleFactor = parentHeight / 130;

        cards.forEach((card, index) => {

            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');

            newCard.initFromByte(card.byteValue);
            newCard.reveal(true);
            newCard.setOnClickListener(this._onSelectCard.bind(this));

            newCard.node.setScale(scaleFactor,scaleFactor);
            this.node.addChild(newCard.node, index, index + 1000);

            newCard.node.on(cc.Node.EventType.TOUCH_START, (event) => {

                if(!this.draggable) return;

                console.log(`touch start position ${event.getLocation().x}`);

                this.node.getComponent(cc.Layout).type = CardList.NONE;

            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {

                if(!this.draggable) return;

                console.log(`touch start position ${event.getLocation().x}`);

                let target = event.target;
                target.x += event.getDelta().x;

                let direction = event.getDelta().x > 0 ? 1 : -1;
                let spacing = this.node.getComponent(cc.Layout).spacingX || this.node.getComponent(cc.Layout).spacingY;
                spacing = spacing || 0;

                let beingSwapNode = this.node.getChildByTag(target.tag + direction);

                if(Math.abs(target.x - beingSwapNode.x) <= 5){

                    // if(beingSwapNode.x + this.cardWidth /2 < parentWidth / 2) {
                    beingSwapNode.x -= direction * (this.cardWidth - Math.abs(spacing));
                    // }
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
                if(this.draggable) return;

                this.node.getComponent(cc.Layout).type = CardList.HORIZONTAL;
            }, this);

            this.cards.push(newCard);

        });

        if(this._type === CardList.VERTICAL){

        }
    }

    _verifyLayoutInitiated(){
        if(!this._layout) {
            this._layout = this.node.addComponent(cc.Layout);
            this._onConfigChanged();
        };
    }

}

app.createComponent(CardList)
