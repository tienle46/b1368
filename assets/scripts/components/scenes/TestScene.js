import utils from 'utils'

cc.Class({
    extends: cc.Component,

    properties: {
        button1: {
            default:null,
            type:cc.Node
        },
        button2: {
            default:null,
            type:cc.Node
        },
        label1: {
            default:null,
            type:cc.Node
        },
        cardListPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    // use this for initialization
    onLoad: function () {
        // console.log();

        this.label1.on(cc.Node.EventType.TOUCH_START,function(){
            "use strict";
            console.log('label 1 clicked');
        });

        // this.label1.runAction(cc.toggleVisibility());
        // this.label1.active = false;
        // this.button2.getComponent(cc.Button).enabled = false;

        this.label1.active = false;


        let cardListNode = cc.instantiate(this.cardListPrefab);
        cardListNode.setAnchorPoint(0.5, 0.5);

        this.node.addChild(cardListNode);
        this.cardList = cardListNode.getComponent('CardList');
        this.cardList._test();
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
