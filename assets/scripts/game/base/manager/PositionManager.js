/**
 * Created by Thanh on 8/23/2016.
 */

var PositionManager = cc.Class({

    properties: {
        board: null
    },

    _init(board){
        this.board = board;
    },

    getPosition(playerId, gameCode){

    },

    getPlayerSeatPosition(playerId){

    },

});

PositionManager.newInstance = function (board) {
    let instance = new PositionManager();
    instance._init(board);
    return instance;
};

module.exports = PositionManager;