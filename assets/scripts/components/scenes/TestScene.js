import utils from 'utils';
import CardList from 'CardList'
import Card from 'Card'

cc.Class({
    extends: cc.Component,

    properties: {
        cardListPrefab: {
            default:null,
            type:cc.Prefab
        },
        anchorPoint: {
            default:null,
            type:cc.Node
        },
        player1: {
            default:null,
            type: cc.Node
        },
        player2: {
            default:null,
            type: cc.Node
        },
        player3: {
            default:null,
            type: cc.Node
        },
        player4: {
            default:null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad: function() {
        this.player1.getComponent('CardList')._setMaxWidth(200);
        this.player1.getComponent('CardList').alignToParent(CardList.RELATION.TOP_LEFT,50,0);
        this.player1.getComponent('CardList')._test();

        this.player2.getComponent('CardList')._setMaxWidth(900);
        this.player2.getComponent('CardList').alignToParent(CardList.RELATION.CENTER_RIGHT,50,0);
        this.player2.getComponent('CardList')._test();

        this.player3.getComponent('CardList')._setMaxWidth(200);
        this.player3.getComponent('CardList').alignToParent(CardList.RELATION.BOTTOM_CENTER,0, 50);
        this.player3.getComponent('CardList')._test();

        this.player4.getComponent('CardList').setType(CardList.VERTICAL);
        this.player4.getComponent('CardList')._setMaxWidth(200);
        this.player4.getComponent('CardList').alignToParent(CardList.RELATION.CENTER_RIGHT,50,0);
        this.player4.getComponent('CardList')._test();


        let cards = [7,11,15,19,23,27,31,35,39,43,47,51].map(value => Card.from(value));
        this.player1.getComponent('CardList').setCards(cards);

         cards = [7,11,15,19,23,27,31,35,39,43,47].map(value => Card.from(value));
        this.player2.getComponent('CardList').setCards(cards);

         cards = [7,11,15,19,23,27,31,35,39,43].map(value => Card.from(value));
        this.player3.getComponent('CardList').setCards(cards);

         cards = [7,11,15,19,23,27,31,35,39,43,47,51,55].map(value => Card.from(value));
        this.player4.getComponent('CardList').setCards(cards);

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onClick1: function(event) {
       this.player2.getComponent('CardList').transferCards(this.player2.getComponent('CardList').selectedCards,this.player3);
       //  const p = event.target.convertToNodeSpaceAR(cc.p(568,565));
       // event.target.runAction(cc.moveTo(0.5,p));


        // console.log(`${event.target.convertToNodeSpace(0,0)}`);
    },
    onClick2: function() {
        console.log('button 2 clicked');
    },

    onClick3: function() {
        console.log('button 3 clicked');
    },

});
