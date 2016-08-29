/**
 * Created by Thanh on 8/27/2016.
 */

var game;
var PhomBoard;
var PhomPlayer;
var TLMNDLBoard;
var TLMNDLPlayer;

const gameCodeToBoardClassMap = {
    'pom': PhomBoard,
    'tnd': TLMNDLBoard
};

const gameCodeToPlayerClassMap = {
    'pom': PhomPlayer,
    'tnd': TLMNDLPlayer
};

var GameManager = cc.Class({

    getBoardClass(gameCode){
        return gameCodeToBoardClassMap[gameCode]
    },

    getPlayerClass(gameCode){
        return gameCodeToPlayerClassMap[gameCode]
    }


});

GameManager.newInstance = () => {
    game = require('game')
    return new GameManager()
}

module.exports = GameManager