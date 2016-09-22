import utils from 'utils';

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
        },
        topAnchor: {
            default:null,
            type:cc.Node
        },
        cardNode: {
            default:null,
            type:cc.Node
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
        this.node.getChildByName("CardHolder").runAction(cc.toggleVisibility());

        // this.cardNode.setScale(0.5,0.5);
        // this.cardNode.setContentSize(this.cardNode.width * 0.5, this.cardNode.height * 0.5);

        //
        // let cardListNode = cc.instantiate(this.cardListPrefab);
        // // let spriteBg = cardListNode.addComponent(cc.Sprite);
        // // spriteBg.spriteFrame =
        // this.node.addChild(cardListNode);
        //
        // // cardListNode.getComponent('CardList')._setMaxWidth(500);
        // // cardListNode.getComponent('CardList')._setMaxHeight(100);
        // cardListNode.getComponent('CardList').setMaxSize(500,100);
        //
        // cardListNode.setAnchorPoint(0.5, 0.5);
        // cardListNode.setPosition(0,0);
        //
        // this.cardList = cardListNode.getComponent('CardList');
        // this.cardList.setDraggable(true);
        // this.cardList._test();
        //
        // console.debug(this.cardList);

        // console.log(`card list width ${cardListNode.width} and spacing ${cardListNode.getComponent('CardList')._layout.spacingX}`);
        // console.log(this.node.getChildByName('SegmentPrefab'));
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
