/**
 * Created by Thanh on 8/23/2016.
 */
var PlayerBetTurnAdapter = require("PlayerBetTurnAdapter")
var BoardCard = require("BoardCard")

var PlayerCardBetTurn = cc.Class({
    extends: BoardCard,
    betAdapter: PlayerBetTurnAdapter,

    ctor(){

    }
});

module.exports = PlayerCardBetTurn;