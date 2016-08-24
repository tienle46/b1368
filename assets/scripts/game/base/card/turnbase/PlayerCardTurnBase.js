/**
 * Created by Thanh on 8/23/2016.
 */

var PlayerTurnBaseAdapter = require("PlayerTurnBaseAdapter")
var BoardCard = require("BoardCard")

cc.PlayCardTurnBase = cc.Class({
    extends: BoardCard,
    turnAdapter: PlayerTurnBaseAdapter,

    ctor(){

    }
});