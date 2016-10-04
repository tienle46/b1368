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

        this.cardListOrientation;
        this.horizontalAlignment;
        this.verticalAlignment;

        this.cards = null;
        this.draggable = false;
        this._cardAnchor;
        this._selectedMargin = 40;
        this.draggable = true;
    }


    getRawCards(){
        return this.cards.filter(card => {return Card.from(card.byteValue)});
    }

    _init(width = 600, height = 80, orientation = CardList.ORIENTATION.HORIZONTAL, alignment ){

        this.cards = this.cards || [];

        this.node.width = width;
        this.node.height = height;


        this.cardListOrientation = orientation;
        if(orientation == CardList.ORIENTATION.HORIZONTAL){
            this._setHorizontalAlignment(alignment);
        }
        else{
            this._setVerticalAlignment(alignment);
        }

        if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
            this.setChildrenScale(this.node.height / CardList.CARD_HEIGHT);
            this._cardWidth = this.getChildrenScale() * CardList.CARD_WIDTH;
        }
        else{
            this.setChildrenScale(this.node.width / CardList.CARD_WIDTH);
            this._cardWidth = this.getChildrenScale() * CardList.CARD_HEIGHT;
        }

        this.node.on('child-added', (event)=>{
            let newChild = event.detail;
            newChild.setAnchorPoint(this.node.getAnchorPoint());

            if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL && this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.LEFT
                || this.cardListOrientation == CardList.ORIENTATION.VERTICAL && this.verticalAlignment == CardList.VERTICAL_ALIGNMENT.TOP
            ){
                if(this.cards.length > 1){
                    const lastZOrder = this.cards[this.cards.length - 2].node.getLocalZOrder();
                    newChild.setLocalZOrder(lastZOrder + 1);
                }
                else{
                    newChild.setLocalZOrder(1);
                }
            }
            else{
                if(this.cards.length > 1){
                    const lastZOrder = this.cards[this.cards.length - 2].node.getLocalZOrder();
                    newChild.setLocalZOrder(lastZOrder -1);
                }
                else{
                    newChild.setLocalZOrder(-1);
                }
            }
        });
        this.node.on('child-removed', (event)=>{


        });

        this.cards = this.cards || [];

        // this._test([37,7,37,7,9,15,18,48,40,50,22,20,14,52,16]);
    }
    getChildrenScale(){
        return this._cardPrefabScale;
    }
    setChildrenScale(scale){
        this._cardPrefabScale = scale;
    }

    _getMaxSpaceAvailable(){
        if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
            return this.node.width;
        }
        return this.node.height;
    }

    _setHorizontalAlignment(alignment = CardList.HORIZONTAL_ALIGNMENT.LEFT){
        this.horizontalAlignment = alignment;
    }
    _setVerticalAlignment(alignment = CardList.VERTICAL_ALIGNMENT.TOP){
        this.verticalAlignment = alignment;
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
    _updateCardSpacing(){ 
        let numberOfCards = this.cards.length; 
        let cardDistance = (this._getMaxSpaceAvailable() - this._cardWidth) / (numberOfCards -1); 
        if(cardDistance > this._cardWidth) { 
            cardDistance = this._cardWidth; 
        } 
        this._cardSpacing = cardDistance - this._cardWidth; 
    }
    _adjustCardsPosition(){

        let lastChildNode = this._getLastChild();
        if(lastChildNode){
            // let firstChild = this.node.children[0];


            // Với trường hợp không phải là căn giữa, việc sắp xếp lại toàn bộ card chỉ xảy ra khi số lượng quân bài lớn vượt quá vùng hiển thị
            if(!this._isCenterAlignment())
            {
                // if(numberOfCards * this._getCardDistance() + this._cardWidth > this._getMaxSpaceAvailable()){

                    this._updateCardSpacing();

                    this.cards.forEach((card, index)=>{

                        if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
                            if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.LEFT){
                                card.node.x = this._getStartPosition().x + this._getCardDistance() * index;
                            }
                            else if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.RIGHT){
                                card.node.x = this._getStartPosition().x - this._getCardDistance() * index;
                            }
                        }
                        else{
                            if(this.verticalAlignment == CardList.VERTICAL_ALIGNMENT.TOP){
                                card.node.y = this._getStartPosition().x - this._getCardDistance() * index;
                            }
                            else if(this.verticalAlignment == CardList.VERTICAL_ALIGNMENT.BOTTOM){
                                card.node.y = this._getStartPosition().x + this._getCardDistance() * index;
                            }
                        }
                        // console.log(`${node.getComponent('Card').rank} index ${index} / zIndex ${node.zIndex}`);
                    });
                // }
            }
            else{
                //Với trường hợp alignment là center, mỗi card được add vào đều trigger sự kiện sắp xếp lại card
                this._updateCardSpacing();

                let newStartXPosition = (this._getMaxSpaceAvailable() - this._getCardDistance() * (this.cards.length - 1)) / 2 - this._cardWidth  * this.node.anchorX;
                this.cards.forEach((card,index)=>{
                    card.node.x = newStartXPosition + index * this._getCardDistance();
                    card.node.setLocalZOrder(index);
                });

            }
        }
    }

    _getStartPosition(){

        if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
            if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.LEFT){
                let x = 0 - this._getMaxSpaceAvailable() * this.node.anchorX + this._cardWidth * this.node.anchorX;
                return cc.v2(x,0);
            }
            else if (this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.RIGHT){
                let x = this._getMaxSpaceAvailable() * this.node.anchorX - this._cardWidth * this.node.anchorX;
                return cc.v2(x,0);
            }
            else if (this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.CENTER){
                //WARNING : Không có nhiều ý nghĩa vì sẽ được tính toán lại ở hàm _adjustCardsPosition()
                let x = this._getMaxSpaceAvailable() * (0.5 - this.node.anchorX) - this._cardWidth * this.node.anchorX;
                return cc.v2(x,0);
            }
        }
        else{
            //TODO
            if(this.verticalAlignment == CardList.VERTICAL_ALIGNMENT.TOP){
                let y = 0 - this._getMaxSpaceAvailable() * this.node.anchorY + this._cardWidth * this.node.anchorY;
                return cc.v2(0,y);
            }
            else if (this.verticalAlignment == CardList.VERTICAL_ALIGNMENT.BOTTOM){
                let y = this._getMaxSpaceAvailable() * (this.node.anchorY - 1) - this._cardWidth * this.node.anchorY;
                return cc.v2(0,y);
            }
        }
    }

    _getPositionForNextCard(){

        let childPosition = this._getStartPosition();

        if(this._getLastChild()){

            if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
                if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.LEFT){
                    childPosition.x += this.node.childrenCount * this._getCardDistance();
                }
                else if(this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.RIGHT){
                    childPosition.x -= this.node.childrenCount * this._getCardDistance();
                }
                else if (this.horizontalAlignment == CardList.HORIZONTAL_ALIGNMENT.CENTER){
                    //Với trường hợp aligmnet center, mặc định set position trùng với card cuối cùng hiện trong list
                    // Việc sắp xếp lại do hàm adjust thực hiện
                    childPosition.x = this._getLastChild().x;
                }
            }
            else if(this.cardListOrientation == CardList.ORIENTATION.VERTICAL){
                if(this.verticalAlignment == CardList.VERTICAL_ALIGNMENT.TOP){
                    childPosition.y -= this.node.childrenCount * this._getCardDistance();
                }
                if(this.verticalAlignment == CardList.VERTICAL_ALIGNMENT.BOTTOM){
                    childPosition.y += this.node.childrenCount *  this._getCardDistance();
                }
            }

        }

        return childPosition;
    }

    _shiftCards(startIndex, direction = 1){
        for(let i = startIndex; i < this.cards.length; i++){
            this.cards[i].node.x += direction * this._getCardDistance();
        }
    }
    _swapCard(idx1,idx2){

        [this.cards[idx1], this.cards[idx2]] = [this.cards[idx2], this.cards[idx1]];
        this.node.children[idx1].setLocalZOrder(idx2);
        this.node.children[idx2].setLocalZOrder(idx1);
        [this.node.children[idx1], this.node.children[idx2]] = [this.node.children[idx2], this.node.children[idx1]];
    }

    fillCards(cardBytes, active = true, reveal = true){
        cardBytes.forEach((byte,index)=>{
            const newCard = this._createNewCard(byte,reveal);
            newCard.node.active = active;

            this.cards.push(newCard);
            this.node.addChild(newCard.node);


            newCard.node.on(cc.Node.EventType.TOUCH_START, (event) => {
                if(!this.draggable) return;

            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {

                if(!this.draggable) return;

                const dragCard = event.target.getComponent('Card');
                dragCard.node.x += event.getDelta().x;

                // let localPoint = this.node.convertToNodeSpaceAR(event.getLocation());
                // console.log(`local point x ${localPoint.x}`);

                let direction = event.getDelta().x > 0 ? 1 : -1;

                let dragCardIndex = this.cards.indexOf(dragCard);
                // console.log(`dragCardIndex ${dragCardIndex}`);
                let swapCard = this.cards[dragCardIndex + direction];
                if(swapCard){
                    if(Math.abs(swapCard.node.x - dragCard.node.x) < this._getCardDistance() / 2){
                        swapCard.node.x -= direction * this._getCardDistance();
                        this._swapCard(dragCardIndex,dragCardIndex + direction);
                    }

                }

            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_END, (event) => {
                if(!this.draggable) return;

                const dragCard = event.target.getComponent('Card');
                //NOTE : drag chỉ áp dụng duy nhất cho myself, quân bài dàn từ trái qua phải, khi sự kiện touch kết thúc chỉ cần xử lí cho trường hơp này
                let dragCardIndex = this.cards.indexOf(dragCard);
                dragCard.node.x = this._getStartPosition().x + dragCardIndex * this._getCardDistance();
            }, this);

            if(this._isCenterAlignment()){
                this._adjustCardsPosition();
            }
        });

        //check to see if need to overlap cards to fit space
        if(!this._isCenterAlignment()){
            this._adjustCardsPosition();
        }
    }

    removeCards(cards){
        // Remove card models
        _.pullAll(this.cards, cards);

        cards.forEach((card, index)=>{
            card.node.removeFromParent(true);
        });
    }


    _createNewCard(byte, reveal){
        let newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        newCard.initFromByte(byte);
        newCard.reveal(reveal);
        newCard.node.setScale(this.getChildrenScale());
        // if(this.cardListOrientation == CardList.ORIENTATION.VERTICAL){
        //     newCard.runAction(cc.rotateBy(0,90));
        // }
        newCard.node.setPosition(this._getPositionForNextCard());

        newCard.setOnClickListener(this._onSelectCard.bind(this));

        return newCard;
    }

    getSelectedCards(){
        return this.cards.filter(card=> card.selected);
    }

    setDraggable(draggable){
        this.draggable = draggable;
    }
    _test(cards){
        this.fillCards(cards);
    }
    onLoad () {
        this._init(500,75);
        // this._init(50,300,CardList.ORIENTATION.VERTICAL, CardList.VERTICAL_ALIGNMENT.BOTTOM);
    }

    _onSelectCard(card){

        card.selected = !card.selected;
        if(card.selected){
            if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
                card.node.runAction(cc.moveBy(0.2,0,this._selectedMargin));
            }
            else{
                card.node.runAction(cc.moveBy(0.2,this._selectedMargin,0));
            }
        }
        else{
            if(this.cardListOrientation == CardList.ORIENTATION.HORIZONTAL){
                card.node.runAction(cc.moveBy(0.2,0,-this._selectedMargin));
            }
            else{
                card.node.runAction(cc.moveBy(0.2,-this._selectedMargin,0));
            }
        }
    }

    transfer(cards, destinationList, action){

        let destCardListNode = destinationList instanceof cc.Node ? destinationList : destinationList.node;

        const cardListComponent = destCardListNode.getComponent('CardList');

        // Xoá model object ngay lập tức, sau đó thực hiện animation liệu
        // tránh trường hợp có exception can thiệp animation chưa thực hiện xong để đảm bảo tính nhất quán dữ liệu
        _.pullAll(this.cards, cards);

        let actions = [];

        cards.forEach((card, index)=>{
            cardListComponent.cards.push(card);
            // this._updateCardSpacing();

            const worldPoint = card.node.parent.convertToWorldSpaceAR(card.node.getPosition());
            const localDestinationPoint = destCardListNode.convertToNodeSpaceAR(worldPoint);

            card.node.removeFromParent(false);

            const moveToPosition = cardListComponent._getPositionForNextCard();
            card.node.setPosition(localDestinationPoint);
            card.node.setScale(cardListComponent.getChildrenScale());
            card.selected = false;

            destCardListNode.addChild(card.node);


            actions.push(cc.callFunc(()=>{
                console.log(`move to x ${moveToPosition.x}`);
                if(index < cards.length - 1){
                    card.node.runAction(cc.moveTo(0.5,moveToPosition.x, moveToPosition.y));
                }
                else{
                    card.node.runAction(cc.sequence(cc.moveTo(0.5,moveToPosition.x, moveToPosition.y), cc.delayTime(0.1),cc.callFunc(()=>{
                        cardListComponent._adjustCardsPosition();
                    })));
                }

            }));

            actions.push(cc.delayTime(0.1));

        });

        destCardListNode.runAction(cc.sequence(actions));
        this._adjustCardsPosition();
    }

    drawCards(cardBytes){
        //determine center point of scene
        const centerPoint = cc.v2(480,320);
        this.cards = [];
        this.node.removeAllChildren();
        this.fillCards(cardBytes,false, false);

        let actions = [];

        const localDestinationPoint = this.node.convertToNodeSpaceAR(centerPoint);
        const kCardFlipTime = 0.3;
        const delay = cc.delayTime(0.1);

        const scale = cc.scaleTo(kCardFlipTime / 2, 0, this.getChildrenScale());
        const scaleReverse = cc.scaleTo(kCardFlipTime / 2 , this.getChildrenScale(), this.getChildrenScale());


        this.cards.forEach((card, index)=>{

            const cardPosition = card.node.getPosition().clone();

            actions.push(cc.callFunc(()=>{

                card.node.active = true;

                let animation= cc.sequence(cc.moveTo(0.2,cardPosition.x, cardPosition.y),scale.clone(), cc.callFunc(()=>{
                    card.reveal(true);
                }), scaleReverse.clone());
                card.node.runAction(animation);


            }))
            card.node.setPosition(localDestinationPoint);
            actions.push(delay.clone());

        });

        this.node.runAction(cc.sequence(actions));
    }
}


app.createComponent(CardList);
