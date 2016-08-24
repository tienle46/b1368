/**
 * Created by Thanh on 8/23/2016.
 */

var BoardBetTurnAdapter = require("BoardBetTurnAdapter")
var BoardCard = require("BoardCard")

var BoardCardBetTurn = cc.Class({
    extends: BoardCard,
    betAdapter: BoardBetTurnAdapter,

    ctor(){

    }
});

module.exports = BoardCardBetTurn;