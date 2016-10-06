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
        cardFilter: {
            default:null,
            type: cc.Node
        },

        firstRender: true
    },

    // use this for initialization
    onLoad: function() {

    },
    start(){

        this.cardFilter.getComponent('CardList').setProperties({maxDimension: 50, orientation:CardList.HORIZONTAL});
        this.cardFilter.getComponent('CardList').setAnchorPoint(0,0);


        let deckCards = [];
        for(let i = 5 ; i < 57; i++){
            deckCards.push(i);
        }

        this.cardFilter.getComponent('CardList').setCards(deckCards.map(byteValue => Card.from(byteValue)));

        this.player1.getComponent('CardList').setProperties({maxDimension: 50, orientation:CardList.VERTICAL});
        this.player1.getComponent('CardList').setAnchorPoint(0,0);
        // this.player1.getComponent('CardList').drawCards(GameUtils.convertBytesToCards([37,7,9,15,18,48,40,50,22,20,14,52,16]));

        this.player2.getComponent('CardList').setProperties({scale:0.6, maxDimension: 500});
        this.player2.getComponent('CardList').setAnchorPoint(0,0);
        // this.player2.getComponent('CardList').drawCards(GameUtils.convertBytesToCards([37,7,9,15,18,48,40,50,22,20,14,52,16]), 0.1);
        //
        // this.player4.getComponent('CardList').setProperties({scale: 0.5, maxDimension: 200, orientation: CardList.VERTICAL, alignment: CardList.ALIGN_BOTTOM_LEFT});
        this.player4.getComponent('CardList').setProperties({scale: 0.5, x: -100, maxDimension: 50, alignment: CardList.ALIGN_BOTTOM_LEFT});
        this.player4.getComponent('CardList').setAnchorPoint(0, 0);
        // this.player4.getComponent('CardList').drawCards(GameUtils.convertBytesToCards([37,7,37,7,9,15]));
        //
        this.player3.getComponent('CardList').setProperties({scale: 0.5, x: -100, maxDimension: 50, alignment: CardList.ALIGN_BOTTOM_LEFT});
        this.player3.getComponent('CardList').setAnchorPoint(0.5, 0.5);
        // this.player3.getComponent('CardList').drawCards(GameUtils.convertBytesToCards([37,7,37,7,9,15]));

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onClick1: function(event) {
        // this.player2.getComponent('CardList').transfer(this.player2.getComponent('CardList').getSelectedCards(),this.player3);
        //
        // if(this.player3.getComponent('CardList').cards.length > 0){
        //
        // }

        // this.player2.getComponent('CardList')._shiftCards(5);

        // this.player2.getComponent('CardList').cards.forEach((card)=>{
        //     card.node.setAnchorPoint(cc.v2(1,1));
        //     card.node.children.forEach((node)=>{
        //         "use strict";
        //         node.setAnchorPoint(cc.v2(1,1));
        //     });
        // });

        let actions = CardList.dealCards(0.3, [this.player2.getComponent('CardList')
            ,this.player1.getComponent('CardList')
            ,this.player3.getComponent('CardList')
            ,this.player4.getComponent('CardList')], 13, ()=>{
                "use strict";
                alert('chia bai xong');
        })

        this.node.runAction(cc.sequence(actions));
    },
    onClick2: function() {
    },

    onClick3: function() {
    },

});
