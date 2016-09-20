import app from 'app'
import Component from 'Component'
import Card from 'Card'
var _ = require('lodash');


class CardHolder extends Component {

    constructor() {
        super();
        this.cardPrefab = cc.Prefab;
        this.cards = [];
        this.cardBytes =[];
        this.selectedCards = [];

        this.cardWidth = 0;
        // this.playerPosition = {
        //     default : 0,
        //     type: cc.Integer
        // };

    }

    // use this for initialization
    onLoad () {
        //
        // for(let rank = 1; rank < 14; rank++){
        //     this.cards.push({rank:rank, suit:3});
        // }
        //
        // this.cards.forEach(card =>{
        //
        //     var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
        //     this.node.addChild(newCard.node);
        //     newCard.node.setScale(0.8,0.8);
        //     newCard.init(card.rank,card.suit);
        //     newCard.reveal(true);
        //     newCard.listenOnClickListener((newCard) => {
        //         this.cardPicked(newCard);
        //     });
        //
        // });
        this.cardBytes = [39,35,11,20,25,14,33];

        this.initHolderArea(17, 100,800,150,cc.Layout.Type.HORIZONTAL,cc.Layout.HorizontalDirection.LEFT_TO_RIGHT);

        this.fillHolderWithCards(this.cardBytes);

        // this.node.runAction(cc.rotateBy(0,90));

    }
    cardPicked(card){

        // console.log('picked card index ' + this.cards.indexOf(card));
        if(!card.selected) {
            this.raiseCards([card]);
        }
        else{
            this.lowerCards([card]);
        }
        card.selected = !card.selected;

        if(card.selected){
            this.selectedCards.push(card);
        }
        else{
            _.pullAll(this.selectedCards, [card]);
        }

        // if(this.selectedCards.length === 5){
        //     this.removeCards(this.selectedCards);
        //     this.selectedCards = [];
        // }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


    initHolderArea (x, y, width,height, type, direction){

        this.node.x = x;
        this.node.y = y;
        this.node.width = width;
        this.node.height = height;

        this.cardWidth = 100 * this.node.height / 130;
        let numberOfCards = this.cardBytes.length;
        let spacing = 0;

        if (numberOfCards * this.cardWidth > this.node.width){
            spacing = - (numberOfCards * this.cardWidth - this.node.width ) / (numberOfCards - 1)
        }

        console.log(`mininum spacing required ${spacing}`);
        let layout = this.node.addComponent(cc.Layout);
        layout.type = type;
        layout.direction = direction;
        layout.resizeMode = cc.Layout.ResizeMode.NONE;

        if(layout.type === cc.Layout.Type.HORIZONTAL){
            layout.spacingX = spacing;
        }
        else if (layout.type === cc.Layout.Type.VERTICAL){
            layout.spacingY = spacing;
        }

    }
    /**
     * Fill cards vào holder area
     * @param cards: Danh sách card được fill vào area
     * @param faceDown: Sau khi sắp xếp vào card holder, hiển thị face up hay facedown
     * @param animation: Animation được thực thi khi fill card
     */
    fillHolderWithCards (cards, faceDown, animation){

        const parentHeight = this.node.height;
        const scaleFactor = parentHeight / 130;

        cards.forEach((byteValue,index) =>{

            var newCard = cc.instantiate(this.cardPrefab).getComponent('Card');
            this.node.addChild(newCard.node, index, index + 1000);
            newCard.node.setScale(scaleFactor,scaleFactor);

            newCard.initFromByte(byteValue);
            newCard.reveal(true);

            newCard.listenOnClickListener((newCard) => {
                this.cardPicked(newCard);
            });

            newCard.node.on(cc.Node.EventType.TOUCH_START, function (event) {
                console.log(`touch start position ${event.getLocation().x}`);
                this.node.getComponent(cc.Layout).type = cc.Layout.Type.NONE;
            }, this);
            newCard.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
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
            newCard.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                this.node.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
            }, this);
            this.cards.push(newCard);

        });
        if(this.layoutType === cc.Layout.Type.VERTICAL){

        }
    }

    /**
     *
     * @param cards
     * @param animation
     */
    removeCards(cards,animation){
        cards.forEach(card => {
            this.node.removeChild(card.node);
        });
        _.pullAll(this.cards,cards);
    }
    /**
     * Rút một quân bài từ lọc vào bài trên tay của Player
     * @param card
     * @param faceDown
     * @param animation
     */
    drawCard (card, faceDown, animation){
        this.fillHolderWithCards([card], faceDown,animation);
    }

    /**
     * Khi Player lựa chọn quân bài, thực hiện nâng quân bài cao hơn so với các quân bài bình thường
     * @param cards
     */
    raiseCards (cards){
        this.moveCards(cards,0,50);
    }
    lowerCards (cards){
        this.moveCards(cards,0,-50);
    }

    moveCards (cards, deltaX, deltaY){
        var nodeAction = cc.moveBy(0.1,deltaX,deltaY);
        for (let card of cards) {
            card.node.runAction(nodeAction);
        }
    }

}

app.createComponent(CardHolder)
