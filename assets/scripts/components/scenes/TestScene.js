import utils from 'utils';
import CardList from 'CardList'
import Card from 'Card'

import GameUtils from 'GameUtils';
import Phom from "../../game/games/phom/Phom";
import PhomList from "../../game/games/phom/PhomList";
import PhomUtils from "../../game/games/phom/PhomUtils";
import PhomGenerator from "../../game/games/phom/PhomGenerator";
import FriendProfilePopupRub from 'FriendProfilePopupRub';
import Props from 'Props';

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

        myselfNode: {
            default:null,
            type: cc.Node
        },

        deckCard: {
            default:null,
            type: cc.Node
        },

        playCard: {
            default:null,
            type: cc.Node
        },

        bottomCard: {
            default:null,
            type: cc.Node
        },

        firstRender: true
    },

    // use this for initialization
    onLoad: function() {
        // let player = this.myselfNode.getComponent('PlayerTLMNDL');
        // player.setRenderer(this.myselfNode.getComponent('PlayerTLMNDLRenderer'));
    },
    start(){


    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onClick1(){
        FriendProfilePopupRub.show(this.node, 'pinocchio', this.player1, this.player2);
        // Props.playPropAtIndex(0, this.player1, this.player2);
    },

});
