import app from 'app';
import Component from 'Component';
import Card from 'Card';
import utils from 'utils';
var _ = require('lodash');

export default class CardList extends Component {

    constructor() {
        super();

        this.cardPrefab = cc.Prefab;

        this.scale = {
            default: 1,
            type: cc.Float
        };

        this.reveal = {
            default: true,
            type: cc.Boolean
        };

        this.selectable = {
            default: false,
            type: cc.Boolean
        };

        this.space = {
            default: CardList.CARD_WIDTH,
            type: cc.Integer
        };

        this.maxDimension = {
            default: CardList.DEFAULT_MAX_WIDTH,
            type: cc.Integer
        };

        this.orientation = {
            default: CardList.HORIZONTAL,
            type: cc.Integer
        };

        this.align = {
            default: CardList.ALIGN_CENTER_LEFT,
            type: cc.Integer
        };

        this.cards = null;
        this._draggable = false;
        this._overlapSpace = 0;
        this._selectedMargin = 40;
        this.selectCardChangeListener = null;

    }

    setSelectCardChangeListener(listener) {
        this.selectCardChangeListener = listener;
    }

    setSelectable(selectable) {
        this.selectable = selectable;
    }

    setScale(scale){
        this.scale = scale;
        this.cards.forEach(card => {card.node.setScale(scale)});
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
            this.node.width = this.maxDimension;
            this.node.height = this.scale * CardList.CARD_HEIGHT;
            this.space = this.maxDimension == 0 ? 0 : this.scale * CardList.CARD_WIDTH;
        } else {
            this.node.width = this.scale * CardList.CARD_WIDTH;
            this.node.height = this.maxDimension;
            this.space = this.maxDimension == 0 ? 0 : this.scale * CardList.CARD_WIDTH;
        }
    }

    setReveal(reveal) {
        this.reveal = reveal;
    }

    setMaxDimension(value) {
        this.maxDimension = value;
        this._updateNodeSize();
    }

    setOrientation(orientation) {
        this.orientation = orientation;
        this._updateNodeSize();
    }

    setAlignment(align) {
        this.align = align;

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
        this.scale = scale;
        this._updateNodeSize();
    }

    setPosition(x, y) {
        this.node.setPosition(x, y);
    }

    _getMaxSpaceAvailable() {
        return this.maxDimension;
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
            this.align = CardList.ALIGN_BOTTOM_LEFT;
        } else if (x < 0.5 && y == 0.5) {
            this.align = CardList.ALIGN_CENTER_LEFT;
        } else if (x < 0.5 && y > 0.5) {
            this.align = CardList.ALIGN_TOP_LEFT;
        } else if (x == 0.5 && y < 0.5) {
            this.align = CardList.ALIGN_BOTTOM_CENTER;
        } else if (x == 0.5 && y > 0.5) {
            this.align = CardList.ALIGN_TOP_CENTER;
        } else if (x > 0.5 && y < 0.5) {
            this.align = CardList.ALIGN_BOTTOM_RIGHT;
        } else if (x > 0.5 && y == 0.5) {
            this.align = CardList.ALIGN_CENTER_RIGHT;
        } else if (x > 0.5 && y > 0.5) {
            this.align = CardList.ALIGN_TOP_RIGHT;
        } else {
            this.align = CardList.ALIGN_CENTER;
        }
    }

    _getCardDistance() {
        return (this.space + this._overlapSpace);
    }

    _isHorizontal() {
        return this.orientation == CardList.HORIZONTAL;
    }

    _isVertical() {
        return this.orientation == CardList.VERTICAL;
    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isCenterAlignment() {

        let horizontalCenter = (this.orientation == CardList.HORIZONTAL &&
        (this.align == CardList.ALIGN_CENTER || this.align == CardList.ALIGN_TOP_CENTER || this.align == CardList.ALIGN_BOTTOM_CENTER));

        let verticalCenter = this.orientation == CardList.VERTICAL && (this.align == CardList.ALIGN_CENTER);

        return horizontalCenter || verticalCenter;

    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isLeftAlignment() {

        return this.align == CardList.ALIGN_CENTER_LEFT || this.align == CardList.ALIGN_TOP_LEFT || this.align == CardList.ALIGN_BOTTOM_LEFT
    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isRightAlignment() {
        return this.align == CardList.ALIGN_TOP_RIGHT || this.align == CardList.ALIGN_CENTER_RIGHT || this.align == CardList.ALIGN_BOTTOM_RIGHT;
    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isTopAlignment() {
        return this.align == CardList.ALIGN_TOP_LEFT || this.align == CardList.ALIGN_TOP_CENTER || this.align == CardList.ALIGN_TOP_RIGHT;
    }

    /**
     * Using shift bit to check alignment
     *
     * @returns {boolean}
     * @private
     */
    _isBottomAlignment() {
        return this.align == CardList.ALIGN_BOTTOM_LEFT || this.align == CardList.ALIGN_BOTTOM_CENTER || this.align == CardList.ALIGN_BOTTOM_RIGHT;
    }

    _estimateCardSpacing(numberOfCards) {
        let cardDistance = (this._getMaxSpaceAvailable() - this.space) / (numberOfCards - 1);
        if (cardDistance > this.space) {
            cardDistance = this.space;
        }
        let cardSpacing = cardDistance - this.space;
        if (cardSpacing < -this.space) {
            cardSpacing = -this.space;
        }

        return cardSpacing;
    }

    _updateCardSpacing() {

        this._overlapSpace = this._estimateCardSpacing(this.cards.length);
    }

    _adjustCardsPosition() {

        // Với trường hợp không phải là căn giữa, việc sắp xếp lại toàn bộ card chỉ xảy ra khi số lượng quân bài lớn vượt quá vùng hiển thị
        if (!this._isCenterAlignment()) {
            // if(numberOfCards * this._getCardDistance() + this.space > this._getMaxSpaceAvailable()){

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
                newStartXPosition = this._getMaxSpaceAvailable() * (0.5 - this.node.anchorX) - this.cards.length * this._getCardDistance() / 2 + this.space * this.node.anchorX;
            }
            else {
                newStartXPosition = 0 - this._getMaxSpaceAvailable() * this.node.anchorX + this.space * this.node.anchorX;
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
                let x = 0 - this._getMaxSpaceAvailable() * this.node.anchorX + this.space * this.node.anchorX;
                return cc.v2(x, 0);
            }
            else if (this._isRightAlignment()) {
                let x = this._getMaxSpaceAvailable() * this.node.anchorX - this.space * this.node.anchorX;
                return cc.v2(x, 0);
            }
            else if (this._isCenterAlignment()) {
                let x = this._getMaxSpaceAvailable() * (0.5 - this.node.anchorX) - this.space * (0.5 - this.node.anchorX);
                return cc.v2(x, 0);
            }
        }
        else {
            //TODO
            if (this._isTopAlignment()) {
                let y = 0 - this._getMaxSpaceAvailable() * this.node.anchorY + this.space * this.node.anchorY;
                return cc.v2(0, y);
            }
            else if (this._isBottomAlignment()) {
                let y = this._getMaxSpaceAvailable() * (this.node.anchorY - 1) - this.space * this.node.anchorY;
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
        let estimateCardDistance = this.space + this._estimateCardSpacing(this.cards.length + 1);
        if (this._isHorizontal()) {

            if (this._isLeftAlignment()) {
                childPosition.x += this.cards.length * estimateCardDistance;
            }
            else if (this._isRightAlignment()) {
                childPosition.x -= this.cards.length * estimateCardDistance;
            }
            else if (this._isCenterAlignment()) {
                let newStartXPosition = (this._getMaxSpaceAvailable() * (0.5 - this.node.anchorX) - estimateCardDistance * (this.cards.length)) / 2 - this.space * (0.5 - this.node.anchorX);
                childPosition.x = newStartXPosition + this.cards.length * estimateCardDistance;
            }
        }
        else if (this.orientation == CardList.VERTICAL) {
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

    _fillCards(cards, active = true, reveal = this.reveal) {
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
        newCard.node.setScale(this.scale);

        // if(this.orientation == CardList.VERTICAL){
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

        if(!this.selectable){
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

            card.node.removeFromParent(true);
        });

        actions.length > 0 && destCardListNode.runAction(cc.sequence(actions));
        this._adjustCardsPosition();
    }

    /**
     * If cardLengths is array, make sure that
     * @param dealDeckCard
     * @param playersCardLists
     * @param cardLengths
     * @param cb
     * @returns {ActionInterval}
     */
    static dealCards(dealCardAnchor, playersCardLists, cardLengths, cb) {

        let maxLength = 0;
        const delayTime = 0.07 + (4 - playersCardLists.length) * 0.02;
        const delay = cc.delayTime(delayTime);
        const actions = [delay.clone()];
        const centerPoint = dealCardAnchor.parent.convertToWorldSpaceAR(dealCardAnchor.getPosition());

        debug("centerPoint: ", centerPoint);

        if(utils.isNumber(cardLengths)){

            maxLength = cardLengths;

            const fakeCards = Array(cardLengths).fill(5).map(byteValue => Card.from(byteValue));

            playersCardLists.forEach(cardList => cardList.setCards(fakeCards, true, false));

        }else{
            maxLength = Math.max(...cardLengths);

            playersCardLists.forEach((cardList, i) => {

                let fakeCards = Array(cardLengths[i]).fill(5).map(byteValue => Card.from(byteValue));
                cardList.setCards(fakeCards, true, false)

            });
        }

        let order = 52;
        for (let i = 0; i < maxLength; i++) {
            for (let j = 0; j < playersCardLists.length; j++) {

                if(i >= playersCardLists[j].cards.length) continue;

                const card = playersCardLists[j].cards[i];
                const cardPosition = card.node.getPosition();
                const localDestinationPoint = card.node.parent.convertToNodeSpaceAR(centerPoint);

                card.node.setPosition(localDestinationPoint);
                card.node.zIndex = order--;

                let animation = cc.spawn(
                    cc.moveTo(CardList.DRAW_CARD_DURATION, cardPosition.x, cardPosition.y),
                    cc.rotateBy(CardList.DRAW_CARD_DURATION, 720),
                );

                if(i == maxLength - 1 && j == playersCardLists.length - 1){
                    animation = cc.sequence(
                        animation,
                        cc.delayTime(CardList.DRAW_CARD_DURATION + 0.1),
                        cc.callFunc(() => {
                            cb && cb();
                        })
                    );
                }

                actions.push(cc.callFunc(()=> card.node.runAction(animation)));
                actions.push(delay.clone());
            }
        }

        dealCardAnchor.parent.runAction(cc.sequence(actions));
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
CardList.TRANSFER_CARD_DURATION = 0.3;
CardList.DRAW_CARD_DURATION = 0.4;
CardList.CARD_FLIP_TIME = 0.3;

app.createComponent(CardList);
