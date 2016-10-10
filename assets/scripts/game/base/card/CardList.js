import app from 'app';
import Component from 'Component';
import Card from 'Card';
import utils from 'utils';
var _ = require('lodash');


export default class CardList extends Component {

    constructor() {
        super();

        this.cardPrefab = {
            default: null,
            type: cc.Prefab
        };

        this._scale = 1;
        this._draggable = false;
        this._orientation = CardList.HORIZONTAL;
        this._align = CardList.ALIGN_CENTER_LEFT;
        this._maxDimension = CardList.DEFAULT_MAX_WIDTH;

        this._space = CardList.CARD_WIDTH;
        this._overlapSpace = 0;
        this._selectedMargin = 40;

        this.cards = null;
        this.selectCardChangeListener = null;
        this._reveal = true;
        this._selectable = false;
    }

    setSelectCardChangeListener(listener) {
        this.selectCardChangeListener = listener;
    }

    setSelectable(selectable) {
        this._selectable = selectable;
    }

    getRawCards() {
        return this.cards.filter(card => {
            return Card.from(card.byteValue)
        });
    }

    clear() {
        this.cards = [];
        this.node.removeAllChildren(true);
    }

    _updateNodeSize() {
        if (this._isHorizontal()) {
            this.node.width = this._maxDimension;
            this.node.height = this._scale * CardList.CARD_HEIGHT;
            this._space = this._maxDimension == 0 ? 0 : this._scale * CardList.CARD_WIDTH;
        } else {
            this.node.width = this._scale * CardList.CARD_WIDTH;
            this.node.height = this._maxDimension;
            this._space = this._maxDimension == 0 ? 0 : this._scale * CardList.CARD_WIDTH;
        }
    }

    setReveal(reveal) {
        this._reveal = reveal;
    }

    setMaxDimension(value) {
        this._maxDimension = value;
        this._updateNodeSize();
    }

    setOrientation(orientation) {
        this._orientation = orientation;
        this._updateNodeSize();
    }

    setAlignment(align) {
        this._align = align;

        switch (align) {
            case CardList.ALIGN_BOTTOM_LEFT:
                this.node.setAnchorPoint(0, 0);
                break;
            case CardList.ALIGN_BOTTOM_CENTER:
                this.node.setAnchorPoint(0.5, 0);
                break;
            case CardList.ALIGN_BOTTOM_RIGHT:
                this.node.setAnchorPoint(1, 0);
                break;
            case CardList.ALIGN_TOP_LEFT:
                this.node.setAnchorPoint(0, 1);
                break;
            case CardList.ALIGN_TOP_CENTER:
                this.node.setAnchorPoint(0.5, 1);
                break;
            case CardList.ALIGN_TOP_RIGHT:
                this.node.setAnchorPoint(1, 1);
                break;
            case CardList.ALIGN_CENTER_LEFT:
                this.node.setAnchorPoint(0, 0.5);
                break;
            case CardList.ALIGN_CENTER_RIGHT:
                this.node.setAnchorPoint(1, 0.5);
                break;
            default:
                this.node.setAnchorPoint(0.5, 0.5);
        }
    }

    setProperties({scale = 1, x = 0, y = 0, orientation = CardList.HORIZONTAL, alignment = CardList.ALIGN_CENTER_LEFT, maxDimension = undefined} = {}) {
        this.setScale(scale);
        this.setPosition(x, y);
        this.setOrientation(orientation);
        maxDimension = maxDimension || (orientation == CardList.VERTICAL ? CardList.DEFAULT_MAX_HEIGHT : CardList.DEFAULT_MAX_WIDTH);
        this.setMaxDimension(maxDimension);
        this.setAlignment(alignment);
    }

    setScale(scale) {
        this._scale = scale;
        this._updateNodeSize();
    }

    setPosition(x, y) {
        this.node.setPosition(x, y);
    }

    _getMaxSpaceAvailable() {
        return this._maxDimension;
    }

    // _setHorizontalAlignment(alignment = CardList.HORIZONTAL_ALIGNMENT.LEFT){
    //     this.horizontalAlignment = alignment;
    // }
    //
    // _setVerticalAlignment(alignment = CardList.VERTICAL_ALIGNMENT.TOP){
    //     this.verticalAlignment = alignment;
    // }

    _getLastChild() {
        return this.node.childrenCount > 0 && this.node.children[this.node.childrenCount - 1];
    }

    setAnchorPoint(x, y) {
        this.node.setAnchorPoint(x, y);

        if (x < 0.5 && y < 0.5) {
            this._align = CardList.ALIGN_BOTTOM_LEFT;
        } else if (x < 0.5 && y == 0.5) {
            this._align = CardList.ALIGN_CENTER_LEFT;
        } else if (x < 0.5 && y > 0.5) {
            this._align = CardList.ALIGN_TOP_LEFT;
        } else if (x == 0.5 && y < 0.5) {
            this._align = CardList.ALIGN_BOTTOM_CENTER;
        } else if (x == 0.5 && y > 0.5) {
            this._align = CardList.ALIGN_TOP_CENTER;
        } else if (x > 0.5 && y < 0.5) {
            this._align = CardList.ALIGN_BOTTOM_RIGHT;
        } else if (x > 0.5 && y == 0.5) {
            this._align = CardList.ALIGN_CENTER_RIGHT;
        } else if (x > 0.5 && y > 0.5) {
            this._align = CardList.ALIGN_TOP_RIGHT;
        } else {
            this._align = CardList.ALIGN_CENTER;
        }
    }

    _getCardDistance() {
        return (this._space + this._overlapSpace);
    }

    _isHorizontal() {
        return this._orientation == CardList.HORIZONTAL;
    }

    _isVertical() {
        return this._orientation == CardList.VERTICAL;
    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isCenterAlignment() {

        let horizontalCenter = (this._orientation == CardList.HORIZONTAL &&
        (this._align == CardList.ALIGN_CENTER || this._align == CardList.ALIGN_TOP_CENTER || this._align == CardList.ALIGN_BOTTOM_CENTER));

        let verticalCenter = this._orientation == CardList.VERTICAL && (this._align == CardList.ALIGN_CENTER);

        return horizontalCenter || verticalCenter;

    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isLeftAlignment() {

        return this._align == CardList.ALIGN_CENTER_LEFT || this._align == CardList.ALIGN_TOP_LEFT || this._align == CardList.ALIGN_BOTTOM_LEFT
    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isRightAlignment() {
        return this._align == CardList.ALIGN_TOP_RIGHT || this._align == CardList.ALIGN_CENTER_RIGHT || this._align == CardList.ALIGN_BOTTOM_RIGHT;
    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isTopAlignment() {
        return this._align == CardList.ALIGN_TOP_LEFT || this._align == CardList.ALIGN_TOP_CENTER || this._align == CardList.ALIGN_TOP_RIGHT;
    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isBottomAlignment() {
        return this._align == CardList.ALIGN_BOTTOM_LEFT || this._align == CardList.ALIGN_BOTTOM_CENTER || this._align == CardList.ALIGN_BOTTOM_RIGHT;
    }

    _estimateCardSpacing(numberOfCards) {
        let cardDistance = (this._getMaxSpaceAvailable() - this._space) / (numberOfCards - 1);
        if (cardDistance > this._space) {
            cardDistance = this._space;
        }
        let cardSpacing = cardDistance - this._space;
        if (cardSpacing < -this._space) {
            cardSpacing = -this._space;
        }

        return cardSpacing;
    }

    _updateCardSpacing() {

        this._overlapSpace = this._estimateCardSpacing(this.cards.length);
    }

    _adjustCardsPosition() {

        // Với trường hợp không phải là căn giữa, việc sắp xếp lại toàn bộ card chỉ xảy ra khi số lượng quân bài lớn vượt quá vùng hiển thị
        if (!this._isCenterAlignment()) {
            // if(numberOfCards * this._getCardDistance() + this._space > this._getMaxSpaceAvailable()){

            this._updateCardSpacing();

            this.cards.forEach((card, index)=> {

                if (this._isHorizontal()) {
                    if (this._isLeftAlignment()) {
                        card.node.x = this._getStartPosition().x + this._getCardDistance() * index;
                    }
                    else if (this._isRightAlignment()) {
                        card.node.x = this._getStartPosition().x - this._getCardDistance() * index;
                    }
                }
                else {
                    if (this._isTopAlignment()) {
                        card.node.y = this._getStartPosition().x - this._getCardDistance() * index;
                    }
                    else if (this._isBottomAlignment()) {
                        card.node.y = this._getStartPosition().x + this._getCardDistance() * index;
                    }
                }
                // log(`${node.getComponent('Card').rank} index ${index} / zIndex ${node.zIndex}`);
            });
            // }
        }
        else {
            //Với trường hợp alignment là center, mỗi card được add vào đều trigger sự kiện sắp xếp lại card
            this._updateCardSpacing();

            let newStartXPosition;
            if (this._overlapSpace == 0) {
                newStartXPosition = this._getMaxSpaceAvailable() * (0.5 - this.node.anchorX) - this.cards.length * this._getCardDistance() / 2 + this._space * this.node.anchorX;
            }
            else {
                newStartXPosition = 0 - this._getMaxSpaceAvailable() * this.node.anchorX + this._space * this.node.anchorX;
            }
            this.cards.forEach((card, index)=> {
                card.node.x = newStartXPosition + index * this._getCardDistance();
                card.node.setLocalZOrder(index);
            });


        }
    }

    _getStartPosition() {

        if (this._isHorizontal()) {
            if (this._isLeftAlignment()) {
                let x = 0 - this._getMaxSpaceAvailable() * this.node.anchorX + this._space * this.node.anchorX;
                return cc.v2(x, 0);
            }
            else if (this._isRightAlignment()) {
                let x = this._getMaxSpaceAvailable() * this.node.anchorX - this._space * this.node.anchorX;
                return cc.v2(x, 0);
            }
            else if (this._isCenterAlignment()) {
                let x = this._getMaxSpaceAvailable() * (0.5 - this.node.anchorX) - this._space * (0.5 - this.node.anchorX);
                return cc.v2(x, 0);
            }
        }
        else {
            //TODO
            if (this._isTopAlignment()) {
                let y = 0 - this._getMaxSpaceAvailable() * this.node.anchorY + this._space * this.node.anchorY;
                return cc.v2(0, y);
            }
            else if (this._isBottomAlignment()) {
                let y = this._getMaxSpaceAvailable() * (this.node.anchorY - 1) - this._space * this.node.anchorY;
                return cc.v2(0, y);
            }
            else if (this._isCenterAlignment()) {
                //TODO
            }
        }
    }

    _getPositionForNextCard() {
        //Note this method called for card being added to list, not in list yet
        let childPosition = this._getStartPosition();
        let estimateCardDistance = this._space + this._estimateCardSpacing(this.cards.length + 1);
        if (this._isHorizontal()) {

            if (this._isLeftAlignment()) {
                childPosition.x += this.cards.length * estimateCardDistance;
            }
            else if (this._isRightAlignment()) {
                childPosition.x -= this.cards.length * estimateCardDistance;
            }
            else if (this._isCenterAlignment()) {
                let newStartXPosition = (this._getMaxSpaceAvailable() * (0.5 - this.node.anchorX) - estimateCardDistance * (this.cards.length)) / 2 - this._space * (0.5 - this.node.anchorX);
                childPosition.x = newStartXPosition + this.cards.length * estimateCardDistance;
            }
        }
        else if (this._orientation == CardList.VERTICAL) {
            if (this._isTopAlignment()) {
                childPosition.y -= this.cards.length * estimateCardDistance;
            }
            if (this._isBottomAlignment()) {
                childPosition.y += this.cards.length * estimateCardDistance;
            }
        }


        return childPosition;
    }

    _shiftCards(startIndex, direction = 1) {
        for (let i = startIndex; i < this.cards.length; i++) {
            this.cards[i].node.x += direction * this._getCardDistance();
        }
    }

    _swapCard(idx1, idx2) {

        [this.cards[idx1], this.cards[idx2]] = [this.cards[idx2], this.cards[idx1]];
        this.node.children[idx1].setLocalZOrder(idx2);
        this.node.children[idx2].setLocalZOrder(idx1);
        [this.node.children[idx1], this.node.children[idx2]] = [this.node.children[idx2], this.node.children[idx1]];
    }

    setCards(cards, active, reveal) {
        this.clear();
        this._fillCards(cards, active, reveal);

    }

    addCards(cards, active, reveal) {
        return this._fillCards(cards, active, reveal);
    }

    _fillCards(cards, active = true, reveal = this._reveal) {
        let addedCards = [];
        cards.forEach((card, index) => {
            const newCard = this._createNewCard(card.byteValue, reveal);
            newCard.node.active = active;

            this.cards.push(newCard);
            this.node.addChild(newCard.node);
            addedCards.push(newCard);

            newCard.node.on(cc.Node.EventType.TOUCH_START, (event) => {
                if (!this._draggable) return;

            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {

                if (!this._draggable) return;

                const dragCard = event.target.getComponent('Card');
                dragCard.node.x += event.getDelta().x;

                // let localPoint = this.node.convertToNodeSpaceAR(event.getLocation());
                // log(`local point x ${localPoint.x}`);

                let direction = event.getDelta().x > 0 ? 1 : -1;

                let dragCardIndex = this.cards.indexOf(dragCard);
                // log(`dragCardIndex ${dragCardIndex}`);
                let swapCard = this.cards[dragCardIndex + direction];
                if (swapCard) {
                    if (Math.abs(swapCard.node.x - dragCard.node.x) < this._getCardDistance() / 2) {
                        swapCard.node.x -= direction * this._getCardDistance();
                        this._swapCard(dragCardIndex, dragCardIndex + direction);
                    }

                }

            }, this);

            newCard.node.on(cc.Node.EventType.TOUCH_END, (event) => {
                if (!this._draggable) return;

                const dragCard = event.target.getComponent('Card');
                //NOTE : drag chỉ áp dụng duy nhất cho myself, quân bài dàn từ trái qua phải, khi sự kiện touch kết thúc chỉ cần xử lí cho trường hơp này
                let dragCardIndex = this.cards.indexOf(dragCard);
                dragCard.node.x = this._getStartPosition().x + dragCardIndex * this._getCardDistance();
            }, this);

        });

        this._adjustCardsPosition();

        return addedCards;
    }

    findCardComponents(cardModels = []) {
        if (cardModels.length == 0) return []

        let filteredCards = this.cards.filter(card => {
            for (let cardModel of cardModels) {
                if (card.equals(cardModel)) {
                    return true;
                }
            }
        });

        return filteredCards;
    }

    _getSubCards(size){
        return size && this.cards.slice(0, size);
    }

    removeCards(cards) {
        let removedCards = this._removeCardModelOnly(cards);
        removedCards.forEach((card, index) => card.node.removeFromParent(true));
    }

    _removeCardModelOnly(cardsOrRemoveAmount){
        let removingCards = utils.isNumber(cardsOrRemoveAmount) ? this._getSubCards(cardsOrRemoveAmount) : this.findCardComponents(cardsOrRemoveAmount);
        _.pullAll(this.cards, removingCards);
        return removingCards;
    }

    _createNewCard(byte, reveal) {
        let newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        newCard.initFromByte(byte);
        newCard.reveal(reveal);
        newCard.node.setScale(this._scale);
        // if(this._orientation == CardList.VERTICAL){
        //     newCard.runAction(cc.rotateBy(0,90));
        // }

        newCard.setOnClickListener(this._onSelectCard.bind(this));

        return newCard;
    }

    getSelectedCards() {
        return this.cards.filter(card=> card.selected);
    }

    setDraggable(draggable) {
        this._draggable = draggable;
    }

    _test(cards) {
        this._fillCards(cards);
    }

    onLoad() {

        this.cards = this.cards || [];

        this.node.on('child-added', (event)=> {
            let newChild = event.detail;
            newChild.setAnchorPoint(this.node.getAnchorPoint());

            if ((this._isHorizontal() && this._isLeftAlignment())
                || (this._isVertical() && this._isTopAlignment())
                || this._isCenterAlignment()
            ) {

                if (this.cards.length > 1) {
                    const lastZOrder = this.cards[this.cards.length - 2].node.getLocalZOrder();
                    newChild.setLocalZOrder(lastZOrder + 1);
                }
                else {
                    newChild.setLocalZOrder(1);
                }
            }
            else {
                if (this.cards.length > 1) {
                    const lastZOrder = this.cards[this.cards.length - 2].node.getLocalZOrder();
                    newChild.setLocalZOrder(lastZOrder - 1);
                }
                else {
                    newChild.setLocalZOrder(-1);
                }
            }
        });

        this._updateNodeSize();
    }

    _onSelectCard(card) {

        if(!this._selectable){
            return;
        }

        card.selected = !card.selected;
        if (card.selected) {
            if (this._isHorizontal()) {
                card.node.runAction(cc.moveBy(0.2, 0, this._selectedMargin));
            }
            else {
                card.node.runAction(cc.moveBy(0.2, this._selectedMargin, 0));
            }
        }
        else {
            if (this._isHorizontal()) {
                card.node.runAction(cc.moveBy(0.2, 0, -this._selectedMargin));
            }
            else {
                card.node.runAction(cc.moveBy(0.2, -this._selectedMargin, 0));
            }
        }

        this.onSelectedCardChanged();
    }

    onSelectedCardChanged(){
        this.selectCardChangeListener && this.selectCardChangeListener(this.getSelectedCards());
    }

    /**
     *
     * @param cards
     * @param dest
     */
    transfer(cards, dest, runAnimation) {

        // Xoá model object ngay lập tức, sau đó thực hiện animation
        // tránh trường hợp có exception can thiệp animation chưa thực hiện xong để đảm bảo tính nhất quán dữ liệu
        if(!dest){
            this.removeCards(cards);
            return;
        }

        this._removeCardModelOnly(cards);

        const actions = [];
        const destCardListNode = dest instanceof cc.Node ? dest : dest.node;
        const destCardList = destCardListNode.getComponent(CardList.name);
        const currentDestLength = destCardList.cards.length;

        destCardList._fillCards(cards, true, true);
        destCardList._adjustCardsPosition();
        cards.forEach((card, index)=> {

            const animatingCard = destCardList.cards[currentDestLength + index];

            const worldPoint = card.node.parent.convertToWorldSpaceAR(card.node.getPosition());
            const localDestinationPoint = destCardListNode.convertToNodeSpaceAR(worldPoint);

            const originalScale = card.node.getScale();
            const scaleTo = animatingCard.node.getScale();

            const moveToPosition = animatingCard.node.getPosition();
            animatingCard.node.setPosition(cc.v2(localDestinationPoint.x, localDestinationPoint.y));
            animatingCard.node.setScale(originalScale);

            actions.push(cc.callFunc(() => {
                animatingCard.node.runAction(
                    cc.spawn(
                        cc.moveTo(CardList.TRANSFER_CARD_DURATION, moveToPosition.x, moveToPosition.y),
                        cc.scaleTo(CardList.TRANSFER_CARD_DURATION, scaleTo)
                    )
                );
            }));
            // actions.push(cc.delayTime(0.1));

            card.node.removeFromParent(true);
        });

        actions.length > 0 && destCardListNode.runAction(cc.sequence(actions));
        this._adjustCardsPosition();
    }


    static dealCards(dealDeckCard, playersCardLists, cardLength, cb) {

        const centerPoint = dealDeckCard.node.parent.convertToWorldSpace(dealDeckCard.node.getPosition());
        const fakeCards = Array(cardLength).fill(5).map(byteValue => Card.from(byteValue));
        const deckScale = dealDeckCard.node.getComponent('CardList')._scale;
        const delay = cc.delayTime(0.1);

        let actions = [];

        playersCardLists.forEach((cardList)=> {
            cardList._fillCards(Array.from(fakeCards), false, false);
        })

        for (let i = 0; i < cardLength; i++) {
            for (let j = 0; j < playersCardLists.length; j++) {

                // const scale = cc.scaleTo(CardList.CARD_FLIP_TIME / 2, 0, playersCardLists[j]._scale);
                // const scaleReverse = cc.scaleTo(CardList.CARD_FLIP_TIME / 2 , playersCardLists[j]._scale, playersCardLists[j]._scale);

                const card = playersCardLists[j].cards[i];
                const localDestinationPoint = card.node.parent.convertToNodeSpaceAR(centerPoint);

                const cardPosition = card.node.getPosition();
                const originalScale = card.node.getScale();
                card.node.setScale(deckScale);

                actions.push(cc.callFunc(()=> {

                    card.node.active = true;

                    let animation;

                    if (i < cardLength - 1 || j < playersCardLists.length - 1) {
                        animation = cc.spawn(
                            cc.moveTo(CardList.DRAW_CARD_DURATION, cardPosition.x, cardPosition.y),
                            cc.scaleTo(CardList.DRAW_CARD_DURATION, originalScale),
                        );
                    }
                    else {
                        animation = cc.sequence(
                            cc.spawn(
                                cc.moveTo(CardList.DRAW_CARD_DURATION, cardPosition.x, cardPosition.y),
                                cc.scaleTo(CardList.DRAW_CARD_DURATION, originalScale),
                            ),
                            cc.delayTime(1),
                            cc.callFunc(() => {
                                cb();
                            }),
                        );
                    }
                    card.node.runAction(animation);

                }))
                card.node.setPosition(localDestinationPoint);
                actions.push(delay.clone());
            }
        }

        return cc.sequence(actions);
    }
}

CardList.ALIGN_BOTTOM_LEFT = 1;
CardList.ALIGN_BOTTOM_CENTER = 2;
CardList.ALIGN_BOTTOM_RIGHT = 3;
CardList.ALIGN_TOP_LEFT = 4;
CardList.ALIGN_TOP_CENTER = 5;
CardList.ALIGN_TOP_RIGHT = 6;
CardList.ALIGN_CENTER_LEFT = 7;
CardList.ALIGN_CENTER_RIGHT = 8;
CardList.ALIGN_CENTER = 10;
CardList.HORIZONTAL = 1;
CardList.VERTICAL = 2;
CardList.CARD_WIDTH = 100;
CardList.CARD_HEIGHT = 130;
CardList.DEFAULT_MAX_WIDTH = 600;
CardList.DEFAULT_MAX_HEIGHT = 300;
CardList.TRANSFER_CARD_DURATION = 0.4;
CardList.DRAW_CARD_DURATION = 0.4;
CardList.CARD_FLIP_TIME = 0.3;

app.createComponent(CardList);
