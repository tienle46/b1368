import utils from 'utils';
import CardList from 'CardList'

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
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onClick1: function() {
        console.log('button 1 clicked');
    },
    onClick2: function() {
        console.log('button 2 clicked');
    },

    onClick3: function() {
        console.log('button 3 clicked');
    },

});
