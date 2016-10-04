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

        firstRender: true
    },

    // use this for initialization
    onLoad: function() {

    },
    start(){
        this.player2.getComponent('CardList')._init(500,75);
        this.player2.getComponent('CardList').setCardAnchor(cc.v2(0,0));
        // this.player2.getComponent('CardList')._test([37,7,37,7,9,15,18,48,40,50,22,20,14,52,16]);
        //
        //
        // this.player4.getComponent('CardList')._init(50,300,CardList.ORIENTATION.VERTICAL, CardList.VERTICAL_ALIGNMENT.TOP);
        // this.player4.getComponent('CardList').setCardAnchor(cc.v2(0,));
        // this.player4.getComponent('CardList')._test([37,7,37,7,9,15]);
        //
        // this.player3.getComponent('CardList')._init(300,75,CardList.ORIENTATION.HORIZONTAL,CardList.HORIZONTAL_ALIGNMENT.LEFT);
        // this.player3.getComponent('CardList').setCardAnchor(cc.v2(0,));
        // this.player3.getComponent('CardList')._test([37,7,37,7,9,15]);
        this.player2.getComponent('CardList').drawCards([37,7,9,15,18,48,40,50,22,20,14,52,16]);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onClick1: function(event) {
        // this.player2.getComponent('CardList').transfer(this.player2.getComponent('CardList').getSelectedCards(),this.player3);

        this.player2.getComponent('CardList')._shiftCards(5);
    },
    onClick2: function() {
    },

    onClick3: function() {
    },

});
