import app from 'app';
import ActionComponent from 'ActionComponent';
import Card from 'Card';
import utils from 'utils';
import CCUtils from "CCUtils";
import ArrayUtils from "ArrayUtils";

export default class CardList extends ActionComponent {

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
        
        this.properties = this.assignProperties({
            scale: 1.0,
            reveal: true,
            selectable: false,
            clickableCard: false,
            draggable: false,
            maxDimension: CardList.DEFAULT_MAX_WIDTH,
            cardPrefab: cc.Prefab,
            space: Card.CARD_WIDTH
        });

        this.cardWidth = Card.CARD_WIDTH;
        this.cardHeight = Card.CARD_HEIGHT;
        this.cards = null;
        this.draggable = false;
        this._overlapSpace = 0;
        this.selectCardChangeListener = null;
        this.onCardClickListener = null;
        this.onAfterLayoutChangedListener = null;
        this.highlight = false;
        this._revealOnClick = false;
        this.__initCards = null;
        this.__initProperties = null;
    }

    getCenterHorizontalPosition(){

        //6 is height of transparent of card in bottom
        let cardHeight = (Card.CARD_HEIGHT + 4) * this.scale;

        if(this.align == CardList.ALIGN_TOP_CENTER){
            return cc.v2(0, -cardHeight);
        }else if(this.align == CardList.ALIGN_CENTER){
            return cc.v2(0, -cardHeight / 2);
        }else{
            let tmpXPosition = ((this.cards.length - 1) * this._overlapSpace + Card.CARD_WIDTH * this.scale)  / 2;
            switch (this.align){
                case CardList.ALIGN_BOTTOM_LEFT:
                    return cc.v2(tmpXPosition, 0)
                case CardList.ALIGN_BOTTOM_RIGHT:
                    return cc.v2(-tmpXPosition, 0)
                case CardList.ALIGN_CENTER_LEFT:
                    return cc.v2(tmpXPosition, -cardHeight / 2)
                case CardList.ALIGN_CENTER_RIGHT:
                    return cc.v2(-tmpXPosition, -cardHeight / 2)
                case CardList.ALIGN_TOP_LEFT:
                    return cc.v2(tmpXPosition, -cardHeight)
                case CardList.ALIGN_TOP_RIGHT:
                    return cc.v2(-tmpXPosition, -cardHeight)
            }
        }

        return cc.v2(0, 0);
    }

    setOnAfterLayoutChangedListener(listener){
        this.onAfterLayoutChangedListener = listener;
    }

    onAfterLayoutChanged(){
        this.onAfterLayoutChangedListener && this.onAfterLayoutChangedListener();
    }

    cleanCardGroup() {

    }

    setHighlightAll(highlight) {
        this.highlight = highlight;
        this.cards && this.cards.forEach(card => {
            card.setHighlight(highlight);
        })
    }

    setHighlight(cards = [], highlight = true) {
        this.cards && this.cards.forEach(card => {
            card.setHighlight(false)
            cards.some(highlightCard => {
                if (card.equals(highlightCard)) {
                    card.setHighlight(highlight);
                    return true;
                }
            })
        })
    }

    clean() {
        this.cards && this.cards.forEach(card => {
            card.setSelected(false, false);
            card.setHighlight(false);
            card.setGroup();
        });
    }

    cleanSelectedCard() {
        this.cards && this.cards.forEach(card => card.setSelected(false, false));
    }

    disableAllCard(){
        this.cards && this.cards.forEach(card => card.setDisableCard(true));
    }

    cleanDisableAllCard(){
        this.cards && this.cards.forEach(card => card.setDisableCard(false));
    }

    cleanHighlight() {
        this.cards && this.cards.forEach(card => card.setHighlight(false));
    }

    setSelectCardChangeListener(listener) {
        this.selectCardChangeListener = listener;
    }

    setSelectable(selectable) {
        this.selectable = selectable;
    }

    setRevealOnClick(revealOnClick) {
        this._revealOnClick = revealOnClick;
    }

    getRawCards() {
        return this.cards.filter(card => {
            return Card.from(card.byteValue)
        });
    }

    clear() {
        this.removeAllCards();
        this.__initCards = null;
    }

    removeAllCards() {
        if (this.cards) {
            this.cards.splice(0, this.cards.length);
        } else {
            this.cards = [];
        }
        if (this.node) {
            CCUtils.clearAllChildren(this.node);
        }
    }

    _updateNodeSize() {
        if (this._isHorizontal()) {
            this.node.width = this.maxDimension;
            this.node.height = this.scale * Card.CARD_HEIGHT;
            this._realSpace = this.maxDimension == 0 ? 0 : this.scale * (this.space || Card.CARD_WIDTH);
        } else {
            this.node.width = this.scale * Card.CARD_WIDTH;
            this.node.height = this.maxDimension;
            this._realSpace = this.maxDimension == 0 ? 0 : this.scale * (this.space || Card.CARD_WIDTH);
        }

        this.cardWidth = Card.CARD_WIDTH * this.scale;
        this.cardHeight = Card.CARD_HEIGHT * this.scale;
        this._overlapSpace = this._realSpace;
    }

    setReveal(reveal) {
        if (this.initiated) {
            this.reveal = reveal;
        } else {
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

            case CardList.ALIGN_BOTTOM_CENTER:
                return cc.v2(0.5, 0);

            case CardList.ALIGN_BOTTOM_RIGHT:
                return cc.v2(1, 0);

            case CardList.ALIGN_TOP_LEFT:
                return cc.v2(0, 1);

            case CardList.ALIGN_TOP_CENTER:
                return cc.v2(0.5, 1);

            case CardList.ALIGN_TOP_RIGHT:
                return cc.v2(1, 1);

            case CardList.ALIGN_CENTER_LEFT:
                return cc.v2(0, 0.5);

            case CardList.ALIGN_CENTER_RIGHT:
                return cc.v2(1, 0.5);

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

    setProperties(properties) {
        this.__initProperties = properties;

        this._initSettedProperties();
    }

    _initSettedProperties(){

        if(!this.__isComponentEnabled) return;

        if(this.__initProperties){
            if(this.__initProperties.space){
                this.space = this.__initProperties.space
            }

            if(this.__initProperties.scale){
                this.scale = this.__initProperties.scale
            }

            if(this.__initProperties.orientation){
                this.orientation = this.__initProperties.orientation
            }

            this.maxDimension = this.__initProperties.maxDimension || (this.__initProperties.orientation == CardList.VERTICAL ? CardList.DEFAULT_MAX_HEIGHT : CardList.DEFAULT_MAX_WIDTH);

            this.setPosition(this.__initProperties.x || 0, this.__initProperties.y || 0);
            this.setAlign(this.__initProperties.alignment || CardList.ALIGN_CENTER_LEFT);
        }

        this._updateNodeSize();
        this.__initProperties = null;
    }

    setScale(scale) {
        this.scale = scale
        this._updateNodeSize();
    }

    setSpace(space){
        this.space = space;
        this._updateNodeSize();
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
        if (this._realSpace == 0 || this.maxDimension == 0) return 0;

        let cardSize = this._isHorizontal() ? this.cardWidth : this.cardHeight;
        let cardDistance = (this.maxDimension - cardSize) / (this.cards.length - 1);
        this._overlapSpace = (cardDistance < this._realSpace ? cardDistance : this._realSpace); //5 is transparent space
    }

    _isSamePosition(pos1, pos2) {
        return pos1 && pos2 && pos1.x == pos2.x && pos1.y == pos2.y;
    }

    _adjustCardsPosition(autoUpdate = true, duration = CardList.TRANSFER_CARD_DURATION) {
        this._updateCardSpacing();
        let startPosition = this._getStartPosition();

        if (this._isHorizontal()) {
            if (this._isRightAlignment()) {
                this.cards.forEach((card, index) => {
                    card.setSelected(false, false);
                    card.node.setLocalZOrder(52 - index);
                    let position = cc.v2(startPosition.x - index * this._overlapSpace, startPosition.y);
                    let currentPosition = this.node.getPosition();
                    // if(this._isSamePosition(currentPosition, card.__originalInfo.position)){
                    //     this.setPosition(position);
                    // }

                    card.setOriginalInfo({position});
                });
            } else {
                this.cards.forEach((card, index) => {
                    card.setSelected(false, false);
                    let position = cc.v2(startPosition.x + index * this._overlapSpace, startPosition.y);
                    card.node.setLocalZOrder(index);

                    let currentPosition = this.node.getPosition();
                    // if(this._isSamePosition(currentPosition, card.__originalInfo.position)){
                    //     this.setPosition(position);
                    // }

                    card.setOriginalInfo({position});
                });
            }
        } else {
            if (this._isBottomAlignment()) {
                this.cards.forEach((card, index) => {
                    card.setSelected(false, false);
                    let position = cc.v2(startPosition.x, startPosition.y + index * this._overlapSpace);
                    card.node.setLocalZOrder(52 - index);

                    let currentPosition = this.node.getPosition();
                    // if(this._isSamePosition(currentPosition, card.__originalInfo.position)){
                    //     this.setPosition(position);
                    // }

                    card.setOriginalInfo({position});
                });
            } else {
                this.cards.forEach((card, index) => {
                    card.setSelected(false, false);
                    let position = cc.v2(startPosition.x, startPosition.y - index * this._overlapSpace)
                    card.node.setLocalZOrder(index);

                    let currentPosition = this.node.getPosition();
                    // if(this._isSamePosition(currentPosition, card.__originalInfo.position)){
                    //     this.setPosition(position);
                    // }

                    card.setOriginalInfo({position});
                });
            }
        }

        if(this.isHidden){
            this.updateFinalPosition();
        }else{
            autoUpdate && this.runCardActions(duration);
        }

    }

    updateFinalPosition() {
        this.cards.forEach(card => card.updateFinalPosition());
    }

    onCardsChanged(reverse = false) {
        this.stopAllCardActions();
        this.updateFinalPosition();
        reverse && this.cards.reverse();
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

    push(card) {
        this.cards.push(card);
    }

    setCards(cards, active, reveal) {
        if (this.initiated) {
            this.removeAllCards();
            this._fillCards({cards, active, reveal, autoAdjust: true, adjustDuration: 0});
            this.__initCards = null
        } else {
            this.__initCards = [...cards];
        }
    }

    addCards(cards, active, reveal) {
        return this._fillCards({cards, active, reveal});
    }

    _fillCards({cards = [], active = true, reveal = this.reveal, autoAdjust = undefined, adjustDuration = undefined, reverse = false} = {}) {

        this.cleanSelectedCard();

        let addedCards = [];
        cards.forEach((card, index) => {
            if (card) {
                const newCard = this._createNewCard(card.byteValue, reveal);
                newCard.node.active = active;
                newCard.setLocked(card.locked)

                reverse ? this.cards.splice(0, 0, newCard) : this.cards.push(newCard);
                this.node.addChild(newCard.node);
                addedCards.push(newCard);
            }

            // newCard.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            //     if (!this.draggable) return;
            //
            // }, this);
            //
            // newCard.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            //
            //     if (!this.draggable) return;
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
            //     if (!this.draggable) return;
            //
            //     const dragCard = event.target.getComponent('Card');
            //     //NOTE : drag chỉ áp dụng duy nhất cho myself, quân bài dàn từ trái qua phải, khi sự kiện touch kết thúc chỉ cần xử lí cho trường hơp này
            //     let dragCardIndex = this.cards.indexOf(dragCard);
            //     dragCard.node.x = this._getStartPosition().x + dragCardIndex * this._getCardDistance();
            // }, this);

        });

        this._adjustCardsPosition(autoAdjust, adjustDuration);
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
        removedCards.forEach((card, index) => {
            if (card.node) {
                card.node.destroy();
                card.node.removeFromParent(true)
            }
        });
        return removedCards;
    }

    _removeCardModelOnly(cardsOrRemoveAmount) {
        if (utils.isNumber(cardsOrRemoveAmount)) {
            return this.cards.splice(0, cardsOrRemoveAmount);
        } else {
            let removingCards = cardsOrRemoveAmount;
            if (removingCards.filter(card => !card.isEmpty()).length == 0) {
                return this.cards.splice(removingCards.length >= this.cards.length ? 0 : this.cards.length - removingCards.length, removingCards.length);
            } else {
                return ArrayUtils.removeAll(this.cards, cardsOrRemoveAmount, null, true);
            }
        }
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
        this.draggable = draggable;
    }

    onLoad() {

        this.cards = [];
        this.loaded = true;
        this.node.on('child-added', (event) => {

            let newChild = event.detail;
            newChild.setAnchorPoint(this.node.getAnchorPoint());
            let cardComponent = newChild.getComponent('Card');
            cardComponent && cardComponent.onAnchorPointChanged();

            if ((this._isHorizontal() && this._isLeftAlignment()) ||
                (this._isVertical() && this._isTopAlignment()) ||
                this._isCenterAlignment()
            ) {

                if (this.cards.length > 1) {
                    const lastZOrder = this.cards[this.cards.length - 2].node.getLocalZOrder();
                    newChild.setLocalZOrder(lastZOrder + 1);
                } else {
                    newChild.setLocalZOrder(1);
                }
            } else {
                if (this.cards.length > 1) {
                    const lastZOrder = this.cards[this.cards.length - 2].node.getLocalZOrder();
                    newChild.setLocalZOrder(lastZOrder - 1);
                } else {
                    newChild.setLocalZOrder(-1);
                }
            }
        });
    }

    onEnable() {
        super.onEnable();

        this._initSettedProperties();

        this.setAlign(this._settedAlign || this.align);
        this.initiated = true;
        
        if (this.__initCards) {
            this.setCards(this.__initCards);
            this.__initCards = null;
        }

    }

    onDestroy() {
        super.onDestroy();
        this.selectCardChangeListener = null;
    }

    start() {
        this.__reveal != undefined && this.setReveal(this.__reveal);
    }

    setSelecteds(cards, selected = true) {
        this.finishAllCardActions()
        this.cards.forEach(card => card.setSelected(false, false, true))
        cards.forEach(card => card.setSelected(selected, true, true));
    }

    _onSelectCard(card) {

        if (this._revealOnClick) {
            this._revealSingleCard(card);
        } else if (this.selectable || this.clickableCard) {
            this.onCardClickListener && this.onCardClickListener(card);
            if(this.selectable){
                card.setSelected(!card.selected, true, true);
                this.onSelectedCardChanged();
            }
        }
    }

    _revealSingleCard(card) {
        card.setReveal(true);
    }

    onSelectedCardChanged() {
        this.selectCardChangeListener && this.selectCardChangeListener(this.getSelectedCards());
    }

    setOnCardClickListener(listener){
        this.onCardClickListener = listener;
    }

    transferFrom(src, cards = [], cbOrOption) {


        if (cards.length == 0) return;

        if (!src || utils.isEmptyArray(cards)) return;

        let cb, reverse;
        if (utils.isObject(cbOrOption)) {
            cb = cbOrOption.cb;
            reverse = cbOrOption.reverse;
        } else {
            utils.isFunction(cbOrOption) && (cb = cbOrOption);
        }

        this.cleanSelectedCard();

        if (src.reveal) {
            return src.transferTo(this, cards, cb, this.reveal, reverse);
        } else {
            let reveal = cbOrOption && cbOrOption.hasOwnProperty('reveal') ? cbOrOption.reveal : this.reveal;
            src.finishAllCardActions()
            let addedCards = src.addCards(cards, true, reveal);
            return src.transferTo(this, addedCards, cb, this.reveal, reverse);
        }
    }

    /**
     *
     * @param cards
     * @param dest
     */
    transferTo(dest = null, cards = [], cb = null, reveal = dest && dest.reveal, reverse = false) {

        this.cleanSelectedCard();

        // Xoá model object ngay lập tức, sau đó thực hiện animation
        // tránh trường hợp có exception can thiệp animation chưa thực hiện xong để đảm bảo tính nhất quán dữ liệu
        if (cards.length == 0) return;

        const destCardList = dest && dest instanceof cc.Node ? dest.getComponent('CardList') : dest;
        if (!destCardList || !destCardList.cards || !destCardList.node) {
            this.removeCards(cards);
            return;
        }

        this.stopAllCardActions();
        destCardList.stopAllCardActions();

        const currentDestLength = destCardList.cards.length;
        const removedCards = this._removeCardModelOnly(cards);
        const addedCards = destCardList._fillCards({
            cards: removedCards,
            active: true,
            reveal,
            autoAdjust: false,
            reverse
        });

        if(this.isHidden){

            removedCards.forEach((card, index) => {
                const animatingCard = destCardList.cards[reverse ? index : currentDestLength + index];
                const scaleTo = animatingCard.node.getScale();
                const moveToPosition = animatingCard.__originalInfo.position || animatingCard.node.getPosition();

                animatingCard.node.setPosition(moveToPosition);
                animatingCard.node.setScale(scaleTo);
                animatingCard.setOriginalInfo({position: moveToPosition, scale: scaleTo})

                card.node.removeFromParent(true);
            })

            cb && cb(addedCards);

        }else {
            const actions = [];
            destCardList.__endActionCb = () => cb && cb(addedCards);

            removedCards.forEach((card, index) => {

                const originalScale = card.node.getScale();
                const worldPoint = card.node.parent.convertToWorldSpaceAR(card.node.getPosition());

                const animatingCard = destCardList.cards[reverse ? index : currentDestLength + index];
                const localDestinationPoint = destCardList.node.convertToNodeSpaceAR(worldPoint);
                const scaleTo = animatingCard.node.getScale();
                const moveToPosition = animatingCard.__originalInfo.position || animatingCard.node.getPosition();

                animatingCard.node.setPosition(localDestinationPoint);
                animatingCard.node.setScale(originalScale);
                animatingCard.setOriginalInfo({position: moveToPosition, scale: scaleTo})

                card.node.removeFromParent(true);
            });

            destCardList.runCardActions();
            destCardList.node && destCardList.node.runAction(
                cc.sequence(
                    cc.delayTime(CardList.TRANSFER_CARD_DURATION + 0.01),
                    cc.callFunc(() => {
                        destCardList.finishAllCardActions(destCardList, addedCards);
                    })
                )
            );
        }

        this._adjustCardsPosition();
        return addedCards;
    }

    runCardActions(duration = CardList.TRANSFER_CARD_DURATION) {

        if (duration == 0) {
            this.updateFinalPosition();
        } else {
            this.cards.forEach(card => {
                let action = card.createActionFromOriginalInfo(duration);
                action && card.runActionWithCallback([action], () => {
                    this.updateFinalPosition();
                })
            });
        }

    }

    stopAllCardActions(cardList = this, ...args) {
        cardList.node && cardList.node.stopAllActions();
        cardList.cards.forEach(card => card.node && card.node.stopAllActions());
        if (cardList.__endActionCb) {
            let endAction = cardList.__endActionCb;
            cardList.__endActionCb = null;

            endAction(...args);
        }
    }

    finishAllCardActions(cardList = this, ...args) {
        cardList.node && cardList.node.stopAllActions();
        cardList.cards.forEach(card => card.finishCardAction());
        if (cardList.__endActionCb) {
            let endAction = cardList.__endActionCb;
            cardList.__endActionCb = null;

            endAction(...args);
        }
    }

    /**
     * If cardLengths is array, make sure that. My self play card always on position 0 of playersCardLists
     * @param dealDeckCard
     * @param playersCardLists
     * @param cardLengths
     * @param cb
     * @returns {ActionInterval}
     */
    static dealCards(actionComponent, anchorNode, playersCardLists, cardLengths, cb) {

        let maxLength = 0;
        const delayTime = 0.002 + (4 - playersCardLists.length) * 0.005;
        const delay = cc.delayTime(delayTime);
        const actions = [delay.clone()];

        let parentNode = (actionComponent && actionComponent.node) || (anchorNode && anchorNode.parent);
        if (!parentNode) return;

        const centerPoint = parentNode.convertToWorldSpaceAR(anchorNode.getPosition());
        let containMySelf = false;

        if(playersCardLists.length > 1){
            let minScale = playersCardLists[1].scale;
            if(playersCardLists[1].scale != minScale){
                containMySelf = true;
            }
            playersCardLists[0].setScale(minScale);
        }

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

                let isDealForMySelf = containMySelf && j == 0
                if(isDealForMySelf){
                    let playerCardList = playersCardLists[0];
                    let anchorPoint = playerCardList.node.getAnchorPoint();
                    if(anchorPoint.x != 0.5 || anchorPoint.y != 0.5){
                        let translateX = (anchorPoint.x - 0.5) * (Card.CARD_WIDTH + 4) * playerCardList.scale;
                        let translateY = (anchorPoint.y - 0.5) * (Card.CARD_HEIGHT + 4) * playerCardList.scale;

                        localDestinationPoint.x = localDestinationPoint.x + translateX
                        localDestinationPoint.y = localDestinationPoint.y + translateY
                    }
                }
                card.node.setPosition(localDestinationPoint);

                card.node.zIndex = order--;

                /*fake flip action */
                const kFliptTime = 1;
                const scaleTo = cc.scaleTo(kFliptTime, isDealForMySelf ? 0 : card.node.scaleX,  card.node.scaleY);
                const reverse = cc.scaleTo(kFliptTime, card.node.scaleX , card.node.scaleY);

                let animation = cc.sequence(
                    cc.moveTo(CardList.DRAW_CARD_DURATION, cardPosition.x, cardPosition.y),
                    scaleTo,
                    cc.callFunc(()=>{
                        card.setReveal(true);
                    }),
                    reverse
                );
                
                actions.push(cc.callFunc(() => card.node && card.node.runAction(animation)));
                actions.push(delay.clone());
            }
        }

        if (actionComponent) {
            actionComponent.runActionWithCallback(actions, cb, CardList.DRAW_CARD_DURATION + 0.1)
        } else {
            parentNode.runAction(cc.sequence(
                [...actions, cc.delayTime(CardList.DRAW_CARD_DURATION + 0.05), cc.callFunc(() => cb && cb())]
                )
            )
        }
    }

    equals(cardList) {

        if (!cardList || this.cards.length != cardList.cards.length) return false;

        let thisCardBytes = this.cards.map(card => card.byteValue);
        let compareCardBytes = this.cards.map(card => card.byteValue);

        return ArrayUtils.containsAll(thisCardBytes, compareCardBytes);
    }

    setClickableCard(clickableCard){
        this.clickableCard = clickableCard;
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
CardList.DEFAULT_MAX_WIDTH = 600;
CardList.DEFAULT_MAX_HEIGHT = 300;
CardList.TRANSFER_CARD_DURATION = 0.3;
CardList.DRAW_CARD_DURATION = 0.4;
CardList.CARD_FLIP_TIME = 0.5;


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