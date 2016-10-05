import utils from 'utils';
import CardList from 'CardList'
import Card from 'Card'

import GameUtils from 'GameUtils';

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
        this.player2.getComponent('CardList').setProperties({maxDimension: 500});
        this.player2.getComponent('CardList').setAnchorPoint(0,0);
        this.player2.getComponent('CardList').drawCards(GameUtils.convertBytesToCards([37,7,9,15,18,48,40,50,22,20,14,52,16]));
        //
        this.player4.getComponent('CardList').setProperties({scale: 0.5, maxDimension: 200, orientation: CardList.VERTICAL, alignment: CardList.ALIGN_BOTTOM_LEFT});
        this.player4.getComponent('CardList').setAnchorPoint(0, 0);
        this.player4.getComponent('CardList').drawCards(GameUtils.convertBytesToCards([37,7,37,7,9,15]));
        //
        this.player3.getComponent('CardList').setProperties({scale: 0.5, x: -100, maxDimension: 300, alignment: CardList.ALIGN_BOTTOM_LEFT});
        this.player3.getComponent('CardList').setAnchorPoint(0.5, 0.5);
        this.player3.getComponent('CardList').drawCards(GameUtils.convertBytesToCards([37,7,37,7,9,15]));

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onClick1: function(event) {
        this.player2.getComponent('CardList').transfer(this.player2.getComponent('CardList').getSelectedCards(),this.player3);

        // this.player2.getComponent('CardList')._shiftCards(5);
    },
    onClick2: function() {
    },

    onClick3: function() {
    },

});
