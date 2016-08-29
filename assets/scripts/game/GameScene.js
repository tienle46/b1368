/**
 * Created by Thanh on 8/26/2016.
 */

var game = require("game")

cc.Class({
    extends: cc.Component,

    properties: {
        _gameCode: {
            default: null,
            type: String
        },

        board: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad(){
        this.board.init();
    }

});