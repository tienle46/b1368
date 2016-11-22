import app from 'app';
import Component from 'Component';
import Card from 'Card';
import utils from 'utils';
// import PhomUtils from "PhomUtils";
import ArrayUtils from "ArrayUtils";

export default class CardList extends Component {

    constructor() {
        super();

        this.orientation = {
            default: CardList.HORIZONTAL,
            type: CardList.ORIENTATION
        }

        this.align = {
            default: CardList.ALIGN_CENTER_LEFT,
            type: CardList.ALIGN
        }

        this.properties = {
            ...this.properties,
            scale: 1.0,
            reveal: true,
            selectable: false,
            space: CardList.CARD_WIDTH,
            maxDimension: CardList.DEFAULT_MAX_WIDTH,
            cardPrefab: cc.Prefab
        }

        this.cardWidth = CardList.CARD_WIDTH;
        this.cardHeight = CardList.CARD_HEIGHT;
        this.cards = null;
        this._draggable = false;
        this._overlapSpace = 0;
        this.selectCardChangeListener = null;
        this.highlight = false;
    }

    cleanCardGroup() {

    }

    setHighlightAll(highlight) {
        this.highlight = highlight;
        this.cards.forEach(card => {
            card.setHighlight(highlight);
        })
    }

    setHighlight(cards = [], highlight = true) {
        this.cards.forEach(card => {
            cards.some(highlightCard => {
                if (card.equals(highlightCard)) {
                    card.setHighlight(highlight);
                    return true;
                }
            })
        })
    }

    clean() {
        this.cards.forEach(card => {
            card.setSelected(false, true)
            card.setHighlight(false)
            card.setGroup();
        });
    }

    cleanSelectedCard() {
        this.cards.forEach(card => card.setSelected(false, true));
    }

    cleanHighlight() {
        this.cards.forEach(card => card.setHighlight(false));
    }

    setSelectCardChangeListener(listener) {
        this.selectCardChangeListener = listener;
    }

    setSelectable(selectable) {
        this.selectable = selectable;
    }

    getRawCards() {
        return this.cards.filter(card => {
            return Card.from(card.byteValue)
        });
    }

    clear() {
        if (this.cards) {
            this.cards.splice(0, this.cards.length);
        } else {
            this.cards = [];
        }
        this.node && this.node.removeAllChildren(true);
    }

    _updateNodeSize() {
        if (this._isHorizontal()) {
            this.node.width = this.maxDimension;
            this.node.height = this.scale * CardList.CARD_HEIGHT;
            this.space = this.maxDimension == 0 ? 0 : this.scale * (this.space || CardList.CARD_WIDTH);
        } else {
            this.node.width = this.scale * CardList.CARD_WIDTH;
            this.node.height = this.maxDimension;
            this.space = this.maxDimension == 0 ? 0 : this.scale * (this.space || CardList.CARD_WIDTH);
        }

        this.cardWidth = CardList.CARD_WIDTH * this.scale;
        this.cardHeight = CardList.CARD_HEIGHT * this.scale;
        this._overlapSpace = this.space;
    }

    setReveal(reveal) {
        if(this.initiated){
            this.reveal = reveal;
        }else{
            this.__reveal = reveal;
        }
    }

    setMaxDimension(value) {
        this.maxDimension = value;
        this._updateNodeSize();
    }

    setOrientation(orientation) {
        this.orientation = orientation;
        this._updateNodeSize();
    }

    static convertAlignmentToAnchor(align) {
        switch (align) {
            case CardList.ALIGN_BOTTOM_LEFT:
                return cc.v2(0, 0);
                break;
            case CardList.ALIGN_BOTTOM_CENTER:
                return cc.v2(0.5, 0);
                break;
            case CardList.ALIGN_BOTTOM_RIGHT:
                return cc.v2(1, 0);
                break;
            case CardList.ALIGN_TOP_LEFT:
                return cc.v2(0, 1);
                break;
            case CardList.ALIGN_TOP_CENTER:
                return cc.v2(0.5, 1);
                break;
            case CardList.ALIGN_TOP_RIGHT:
                return cc.v2(1, 1);
                break;
            case CardList.ALIGN_CENTER_LEFT:
                return cc.v2(0, 0.5);
                break;
            case CardList.ALIGN_CENTER_RIGHT:
                return cc.v2(1, 0.5);
                break;
            default:
                return cc.v2(0.5, 0.5);
        }
    }

    setAlign(align) {
        if (this.loaded) {
            this.align = align;
            this.node.setAnchorPoint(CardList.convertAlignmentToAnchor(align));
        } else {
            this._settedAlign = align;
        }
    }

    setProperties({scale = 1, x = 0, y = 0, orientation = CardList.HORIZONTAL, alignment = CardList.ALIGN_CENTER_LEFT, maxDimension = undefined} = {}) {
        this.setScale(scale);
        this.setPosition(x, y);
        this.setOrientation(orientation);
        maxDimension = maxDimension || (orientation == CardList.VERTICAL ? CardList.DEFAULT_MAX_HEIGHT : CardList.DEFAULT_MAX_WIDTH);
        this.setMaxDimension(maxDimension);
        this.setAlign(alignment);
    }

    setScale(scale) {
        this.scale = scale;
        this._updateNodeSize();
    }

    setSpace(space) {
        this.space = space;
    }

    setPosition(x, y) {
        this.node.setPosition(x, y);
    }

    setAnchorPoint(x, y) {

        let align = CardList.ALIGN_CENTER;

        if (x < 0.5 && y < 0.5) {
            align = CardList.ALIGN_BOTTOM_LEFT;
        } else if (x < 0.5 && y == 0.5) {
            align = CardList.ALIGN_CENTER_LEFT;
        } else if (x < 0.5 && y > 0.5) {
            align = CardList.ALIGN_TOP_LEFT;
        } else if (x == 0.5 && y < 0.5) {
            align = CardList.ALIGN_BOTTOM_CENTER;
        } else if (x == 0.5 && y > 0.5) {
            align = CardList.ALIGN_TOP_CENTER;
        } else if (x > 0.5 && y < 0.5) {
            align = CardList.ALIGN_BOTTOM_RIGHT;
        } else if (x > 0.5 && y == 0.5) {
            align = CardList.ALIGN_CENTER_RIGHT;
        } else if (x > 0.5 && y > 0.5) {
            align = CardList.ALIGN_TOP_RIGHT;
        }

        this.setAlign(align);
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
        let horizontalCenterAlign = this.align == CardList.ALIGN_TOP_CENTER || this.align == CardList.ALIGN_BOTTOM_CENTER;
        let verticalCenterAlign = this.align == CardList.ALIGN_CENTER_LEFT || this.align == CardList.ALIGN_CENTER_RIGHT;

        return this.align == CardList.ALIGN_CENTER || (horizontalCenterAlign && this._isHorizontal()) || (verticalCenterAlign && this._isVertical());
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

    _updateCardSpacing() {
        if (this.space == 0 || this.maxDimension == 0) return 0;

        let cardSize = this._isHorizontal() ? this.cardWidth : this.cardHeight;
        let cardDistance = (this.maxDimension - cardSize) / (this.cards.length - 1);
        this._overlapSpace = cardDistance < this.space ? cardDistance : this.space;
    }

    _adjustCardsPosition() {

        this._updateCardSpacing();

        let startPosition = this._getStartPosition();
        if (this._isHorizontal()) {


            if (this._isRightAlignment()) {
                this.cards.forEach((card, index) => {
                    card.node.setPosition(startPosition.x - index * this._overlapSpace, startPosition.y);
                    card.node.setLocalZOrder(52 - index);
                });
            }
            else {
                this.cards.forEach((card, index) => {
                    if (!card.node) {
                        console.log(card);
                    }
                    card.node.setPosition(startPosition.x + index * this._overlapSpace, startPosition.y)
                    card.node.setLocalZOrder(index);
                });
            }
        }
        else {
            if (this._isBottomAlignment()) {
                this.cards.forEach((card, index) => {
                    card.node.setPosition(startPosition.x, startPosition.y + index * this._overlapSpace);
                    card.node.setLocalZOrder(52 - index);
                });
            }
            else {
                this.cards.forEach((card, index) => {
                    card.node.setPosition(startPosition.x, startPosition.y - index * this._overlapSpace)
                    card.node.setLocalZOrder(index);
                });
            }
        }


    }

    onCardsChanged() {
        this._adjustCardsPosition();
    }

    _getStartPosition() {
        let totalSpace = this._overlapSpace * (this.cards.length - 1);

        if (!this._isCenterAlignment()) {
            return cc.v2(0, 0);
        } else {
            return this._isHorizontal() ? cc.v2(-totalSpace / 2, 0) : cc.v2(0, totalSpace / 2);
        }
    }

    _swapCard(idx1, idx2) {

        [this.cards[idx1], this.cards[idx2]] = [this.cards[idx2], this.cards[idx1]];
        this.node.children[idx1].setLocalZOrder(idx2);
        this.node.children[idx2].setLocalZOrder(idx1);
        [this.node.children[idx1], this.node.children[idx2]] = [this.node.children[idx2], this.node.children[idx1]];
    }

    push(card) {
        this.cards.push(card);
    }

    addAll(cards) {
        this.cards.push(...cards);
    }

    setCards(cards, active, reveal) {
        this.clear();
        this._fillCards(cards, active, reveal);
    }

    addCards(cards, active, reveal) {
        return this._fillCards(cards, active, reveal);
    }

    _fillCards(cards, active = true, reveal = this.reveal, log) {

        this.cleanSelectedCard();

        let addedCards = [];
        cards.forEach((card, index) => {
            const newCard = this._createNewCard(card.byteValue, reveal);
            newCard.node.active = active;

            this.cards.push(newCard);
            this.node.addChild(newCard.node);
            addedCards.push(newCard);

            // newCard.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            //     if (!this._draggable) return;
            //
            // }, this);
            //
            // newCard.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            //
            //     if (!this._draggable) return;
            //
            //     const dragCard = event.target.getComponent('Card');
            //     dragCard.node.x += event.getDelta().x;
            //
            //     // let localPoint = this.node.convertToNodeSpaceAR(event.getLocation());
            //     // log(`local point x ${localPoint.x}`);
            //
            //     let direction = event.getDelta().x > 0 ? 1 : -1;
            //
            //     let dragCardIndex = this.cards.indexOf(dragCard);
            //     // log(`dragCardIndex ${dragCardIndex}`);
            //     let swapCard = this.cards[dragCardIndex + direction];
            //     if (swapCard) {
            //         if (Math.abs(swapCard.node.x - dragCard.node.x) < this._getCardDistance() / 2) {
            //             swapCard.node.x -= direction * this._getCardDistance();
            //             this._swapCard(dragCardIndex, dragCardIndex + direction);
            //         }
            //
            //     }
            //
            // }, this);
            //
            // newCard.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            //     if (!this._draggable) return;
            //
            //     const dragCard = event.target.getComponent('Card');
            //     //NOTE : drag chỉ áp dụng duy nhất cho myself, quân bài dàn từ trái qua phải, khi sự kiện touch kết thúc chỉ cần xử lí cho trường hơp này
            //     let dragCardIndex = this.cards.indexOf(dragCard);
            //     dragCard.node.x = this._getStartPosition().x + dragCardIndex * this._getCardDistance();
            // }, this);

        });

        this._adjustCardsPosition();

        return addedCards;
    }

    findCardComponents(cardModels = []) {
        if (cardModels.length == 0) return []

        let filteredCards = this.cards.filter(card => {
            for (let i = 0; i < cardModels.length; i++) {
                let cardModel = cardModels[i];
                if (card.equals(cardModel)) {
                    return true;
                }
            }
        });

        return filteredCards;
    }

    _getSubCards(size) {
        return size && this.cards.slice(0, size);
    }

    removeCards(cards) {
        let removedCards = this._removeCardModelOnly(cards);
        removedCards.forEach((card, index) => card.node && card.node.removeFromParent(true));
        return removedCards;
    }

    _removeCardModelOnly(cardsOrRemoveAmount) {
        let removingCards = utils.isNumber(cardsOrRemoveAmount) ? this._getSubCards(cardsOrRemoveAmount) : cardsOrRemoveAmount;
        let removedCards = ArrayUtils.removeAll(this.cards, removingCards, null, true);
        return removedCards;

        // let removingCards = utils.isNumber(cardsOrRemoveAmount) ? this._getSubCards(cardsOrRemoveAmount) : this.findCardComponents(cardsOrRemoveAmount);
        // _.pullAll(this.cards, removingCards);
    }

    _createNewCard(byte, reveal) {

        let newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        newCard.initFromByte(byte);
        newCard.setReveal(reveal);
        newCard.node.setScale(this.scale);
        newCard.setOnClickListener(this._onSelectCard.bind(this));

        return newCard;
    }

    getSelectedCards() {
        return this.cards.filter(card => {
            return card.selected
        });
    }

    setDraggable(draggable) {
        this._draggable = draggable;
    }

    _test(cards) {
        this._fillCards(cards);
    }

    onLoad() {
        this.cards = [];
        this.loaded = true;
    }

    onEnable() {
        super.onEnable();
        this.node.on('child-added', (event) => {
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

        this.setAlign(this._settedAlign || this.align);
        this._updateNodeSize();

        this.initiated = true;
    }

    start(){
        if(this.__reveal != undefined){
            this.setReveal(this.__reveal);
        }
    }

    setSelecteds(cards, selected = true) {
        cards.forEach(card => card.setSelected(selected));
    }

    _onSelectCard(card) {

        if (!this.selectable)  return;

        card.setSelected(!card.selected);

        this.onSelectedCardChanged();
    }

    onSelectedCardChanged() {
        this.selectCardChangeListener && this.selectCardChangeListener(this.getSelectedCards());
    }

    transferFrom(src, cards = [], cbOrOption) {


        if (cards.length == 0) return;

        if (!src || utils.isEmptyArray(cards)) return;

        let cb = utils.isFunction(cbOrOption) ? cbOrOption : cbOrOption && cbOrOption.cb;

        this.cleanSelectedCard();

        if (src.reveal) {
            src.transferTo(this, cards, cb);
        } else {
            
            console.log("transferFrom: ", this.reveal, src.reveal);
            let reveal = cbOrOption && cbOrOption.hasOwnProperty('reveal') ? cbOrOption.reveal : this.reveal;
            let addedCards = src.addCards(cards, true, reveal);
            console.log("transferFrom before transferTo: ", this.reveal, src.reveal);
            src.transferTo(this, addedCards , cb);
        }
    }

    /**
     *
     * @param cards
     * @param dest
     */
    transferTo(dest = null, cards = [], cb = null, reveal = dest && dest.reveal) {

        this.cleanSelectedCard();

        // Xoá model object ngay lập tức, sau đó thực hiện animation
        // tránh trường hợp có exception can thiệp animation chưa thực hiện xong để đảm bảo tính nhất quán dữ liệu
        if (cards.length == 0) {
            return;
        }

        const destCardList = dest && dest instanceof cc.Node ? dest.getComponent(CardList.name) : dest;
        if (!destCardList || !destCardList.cards || !destCardList.node) {
            this.removeCards(cards);
            return;
        }

        const actions = [];
        const removedCards = this._removeCardModelOnly(cards);
        const currentDestLength = destCardList.cards.length;
        const addedCards = destCardList._fillCards(removedCards, true, reveal);

        destCardList._adjustCardsPosition();
        removedCards.forEach((card, index) => {

            const animatingCard = destCardList.cards[currentDestLength + index];

            const worldPoint = card.node.parent.convertToWorldSpaceAR(card.node.getPosition());
            const localDestinationPoint = destCardList.node.convertToNodeSpaceAR(worldPoint);

            const originalScale = card.node.getScale();
            const scaleTo = animatingCard.node.getScale();

            const moveToPosition = animatingCard.node.getPosition();
            animatingCard.node.setPosition(cc.v2(localDestinationPoint.x, localDestinationPoint.y));
            animatingCard.node.setScale(originalScale);

            actions.push(cc.callFunc(() => {

                let animation = cc.spawn(
                    cc.moveTo(CardList.TRANSFER_CARD_DURATION, moveToPosition.x, moveToPosition.y),
                    cc.scaleTo(CardList.TRANSFER_CARD_DURATION, scaleTo)
                );

                animatingCard.node.runAction(
                    cb ? cc.sequence(animation, cc.delayTime(CardList.TRANSFER_CARD_DURATION + 0.01), cc.callFunc(() => {
                        cb && cb(addedCards)
                    })) : animation
                );
            }));

            card.node.removeFromParent(true);
        });

        actions.length > 0 && destCardList.node.runAction(cc.sequence(actions));
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

        if (utils.isNumber(cardLengths)) {

            maxLength = cardLengths;

            const fakeCards = Array(cardLengths).fill(0).map(byteValue => Card.from(byteValue));

            playersCardLists.forEach(cardList => cardList.setCards(fakeCards, true, false));

        } else {
            maxLength = Math.max(...cardLengths);

            playersCardLists.forEach((cardList, i) => {

                let fakeCards = Array(cardLengths[i]).fill(0).map(byteValue => Card.from(byteValue));
                cardList.setCards(fakeCards, true, false)

            });
        }

        let order = 52;
        for (let i = 0; i < maxLength; i++) {
            for (let j = 0; j < playersCardLists.length; j++) {

                if (i >= playersCardLists[j].cards.length) continue;

                const card = playersCardLists[j].cards[i];
                const cardPosition = card.node.getPosition();
                const localDestinationPoint = card.node.parent.convertToNodeSpaceAR(centerPoint);

                card.node.setPosition(localDestinationPoint);
                card.node.zIndex = order--;

                let animation = cc.spawn(
                    cc.moveTo(CardList.DRAW_CARD_DURATION, cardPosition.x, cardPosition.y),
                    cc.rotateBy(CardList.DRAW_CARD_DURATION, 720),
                );

                if (i == (maxLength - 1) && j == (playersCardLists.length - 1)) {
                    animation = cc.sequence(
                        animation,
                        cc.delayTime(CardList.DRAW_CARD_DURATION + 0.1),
                        cc.callFunc(() => {
                            cb && cb();
                        })
                    );
                }

                actions.push(cc.callFunc(() => card.node.runAction(animation)));
                actions.push(delay.clone());
            }
        }

        dealCardAnchor.parent.runAction(cc.sequence(actions));
    }

    equals(cardList) {

        if (!cardList || this.cards.length != cardList.cards.length) return false;

        let thisCardBytes = this.cards.map(card => card.byteValue);
        let compareCardBytes = this.cards.map(card => card.byteValue);

        return ArrayUtils.containsAll(thisCardBytes, compareCardBytes);
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
CardList.ALIGN_CENTER = 9;
CardList.HORIZONTAL = 1;
CardList.VERTICAL = 2;
CardList.CARD_WIDTH = 100;
CardList.CARD_HEIGHT = 130;
CardList.DEFAULT_MAX_WIDTH = 600;
CardList.DEFAULT_MAX_HEIGHT = 300;
CardList.TRANSFER_CARD_DURATION = 0.3;
CardList.DRAW_CARD_DURATION = 0.4;
CardList.CARD_FLIP_TIME = 0.3;


CardList.ALIGN = cc.Enum({
    ALIGN_BOTTOM_LEFT: 1,
    ALIGN_BOTTOM_CENTER: 2,
    ALIGN_BOTTOM_RIGHT: 3,
    ALIGN_TOP_LEFT: 4,
    ALIGN_TOP_CENTER: 5,
    ALIGN_TOP_RIGHT: 6,
    ALIGN_CENTER_LEFT: 7,
    ALIGN_CENTER_RIGHT: 8,
    ALIGN_CENTER: 9
});

CardList.ORIENTATION = cc.Enum({
    HORIZONTAL: 1,
    VERTICAL: 2,
});

app.createComponent(CardList);
