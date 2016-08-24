/**
 * Created by Thanh on 8/23/2016.
 */

var BoardTurnBaseAdapter = require("BoardTurnBaseAdapter")
var BoardCard = require("BoardCard")

cc.BoardCardTurnBase = cc.Class({
    extends: BoardCard,
    turnAdapter: BoardTurnBaseAdapter,
    ctor(){

    }
});