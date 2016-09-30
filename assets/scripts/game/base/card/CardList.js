import app from 'app';
import Component from 'Component';
import Card from 'Card';
var _ = require('lodash');


export default class CardList extends Component {

    static get CARD_WIDTH() { return 100; }
    static get CARD_HEIGHT() { return 130; }

    static get ORIENTATION () {
        return {
            HORIZONTAL : 1,
            VERTICAL : 2,

        }
    }

    static get HORIZONTAL_ALIGNMENT () {
        return {
            LEFT : 1,
            CENTER : 2,
            RIGHT : 3,
        }
    }
    static get VERTICAL_ALIGNMENT () {
        return {
            TOP : 1,
            CENTER : 2,
            BOTTOM : 3,
        }
    }

    constructor() {
        super();

        this.cardPrefab = {
            default: null,
            type: cc.Prefab
        };

        this._cardPrefabScale = 1;
        this._cardWidth;
        this._cardSpacing = 0;
        this.maxWidth = {
            default:600,
            type: cc.Integer
        }
        this.cardListOrientation = CardList.ORIENTATION.HORIZONTAL;
        this.horizontalAlignment = CardList.HORIZONTAL_ALIGNMENT.RIGHT;
        this.verticalAlignment = CardList.VERTICAL_ALIGNMENT.CENTER;

        this.cards = null;
        this.draggable = false;
        this._cardAnchor;
    }


    getRawCards(){
        return this.cards.filter(card => {return Card.from(card.byteValue)});
    }

    _init(width = this.maxWidth, height = 80){

        this.cards = this.cards || [];
        //TODO
        this.maxWidth = width;

        this.node.width = width;
        this.node.height = height;

        this._cardPrefabScale = this.node.height / CardList.CARD_HEIGHT;
        this._cardWidth = this._cardPrefabScale * CardList.CARD_WIDTH;

        this.node.on('child-added', (event)=>{
            let newChild = event.detail;
            newChild.setAnchorPoint(this.node.getAnchorPoint());

            // console.log(`x: ${event.detail.x} y ${event.detail.y} w ${event.detail.width} h${event.detail.height}`);
        });

        this._test();
    }
    _getLastChild(){
        if(this.node.childrenCount > 0){
            return this.node.children[this.node.childrenCount - 1];
        }
        return undefined;
    }

    setCardAnchor(anchor){
        this._cardAnchor = anchor;
        this.node.setAnchorPoint(anchor);
    }

    _getCardDistance(){
        return (this._cardWidth + this._cardSpacing);
    }

    _isCenterAlignment(){
        return (this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL && this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.CENTER)
            || (this.cardListOrientation == CardList.ORIENTATION.VERTICAL && this.verticalAlignment == CardList.VERTICAL_ALIGNMENT.CENTER);
    }

    _adjustCardsPosition(){

        let lastChildNode = this._getLastChild();
        if(lastChildNode){
            let firstChild = this.node.children[0];

            // Với trường hợp không phải là căn giữa, việc sắp xếp lại toàn bộ card chỉ xảy ra khi số lượng quân bài lớn vượt quá vùng hiển thị
            if(!this._isCenterAlignment())
            {
                const numberOfCards = this.node.childrenCount;
                if(numberOfCards * this._getCardDistance() > this.maxWidth){

                    let cardDistance = (this.maxWidth - this._cardWidth) / (numberOfCards -1);
                    this._cardSpacing = cardDistance - this._cardWidth;

                    this.node.children.some((node, index)=>{
                        if(index == 0){
                            if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.LEFT) {
                                node.setLocalZOrder(index);
                            }
                            else if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.RIGHT){
                                node.setLocalZOrder(numberOfCards - index);
                            }
                            return false;
                        }
                        if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.LEFT){
                            node.x = firstChild.getPositionX() + cardDistance * index;
                            node.setLocalZOrder(index);
                        }
                        else if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.RIGHT){
                            node.x = firstChild.getPositionX() - cardDistance * index;
                            node.setLocalZOrder(numberOfCards - index);
                        }

                    });
                }
            }
            else{
                //Với trường hợp alignment là center, mỗi card được add vào đều trigger sự kiện sắp xếp lại card
                const numberOfCards = this.node.childrenCount;

                if(numberOfCards * this._getCardDistance() > this.maxWidth) {

                    let cardDistance = (this.maxWidth - this._cardWidth) / (numberOfCards - 1);
                    this._cardSpacing = cardDistance - this._cardWidth;
                }

                let newStartXPosition = (this.maxWidth - this._getCardDistance() * (numberOfCards - 1)) / 2 - this._cardWidth  * this.node.anchorX;
                this.node.children.forEach((node,index)=>{
                    node.x = newStartXPosition + index * this._getCardDistance();
                    node.setLocalZOrder(index);
                });

            }
        }
    }


    _getStartPosition(){

        if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
            if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.LEFT){
                let x = 0 - this.maxWidth * this.node.anchorX + this._cardWidth * this.node.anchorX;
                return cc.v2(x,0);
            }
            else if (this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.RIGHT){
                let x = this.maxWidth * this.node.anchorX - this._cardWidth * this.node.anchorX;
                return cc.v2(x,0);
            }
            else if (this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.CENTER){
                //WARNING : Không có nhiều ý nghĩa vì sẽ được tính toán lại ở hàm _adjustCardsPosition()
                let x = this.maxWidth * (0.5 - this.node.anchorX) - this._cardWidth * this.node.anchorX;
                return cc.v2(x,0);
            }
        }

    }

    _getPositionForNextCard(){

        let childPosition = this._getStartPosition();

        if(this._getLastChild()){
            if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
                if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.LEFT){
                    childPosition.x = this._getLastChild().x + this._cardWidth + this._cardSpacing;
                }
                else if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.RIGHT){
                    childPosition.x = this._getLastChild().x - this._cardWidth - this._cardSpacing;
                }
            }
            else if (this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.CENTER){
                //Với trường hợp aligmnet center, mặc định set position trùng với card cuối cùng hiện trong list
                // Việc sắp xếp lại do hàm adjust thực hiện
                childPosition.x = this._getLastChild().x;
            }

        }

        return childPosition;
    }

    fillCards(cardBytes){
        cardBytes.forEach((byte,index)=>{
            this.node.addChild(this._createNewCard(byte,true));
            if(this._isCenterAlignment()){
                this._adjustCardsPosition();
            }
        });

        //check to see if need to overlap cards to fit space
        if(!this._isCenterAlignment()){
            this._adjustCardsPosition();
        }

    }

    _test(){
        this.setCardAnchor(cc.v2(0,0));
        // this.fillCards([37,7,9,15,18,48,40,50,22,20,14,52,16]);
        this.fillCards([37,7,9,15,18,48,40,50,22,20,14,52,16]);
    }

    _createNewCard(byte, reveal){
        let newCard = cc.instantiate(this.cardPrefab);
        newCard.getComponent('Card').initFromByte(byte);
        newCard.getComponent('Card').reveal(reveal);
        newCard.setScale(this._cardPrefabScale);
        newCard.setPosition(this._getPositionForNextCard());

        return newCard;
    }

    getSelectedCards(){
        return this.cards.filter(card=> card.selected);
    }

    setDraggable(draggable){
        this.draggable = draggable;
    }

    onLoad () {
        this._init();
    }
}


app.createComponent(CardList);
