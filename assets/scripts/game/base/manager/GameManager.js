/**
 * Created by Thanh on 8/27/2016.
 */

import game from 'game'
import TLMNDLBoard from 'TLMNDLBoard'

var PhomBoard;
var PhomPlayer;
var TLMNDLPlayer;

const gameCodeToBoardClassMap = {
    [game.const.gameCode.PHOM]: PhomBoard,
    [game.const.gameCode.TLMNDL]: TLMNDLBoard
}

const gameCodeToPlayerClassMap = {
    'pom': PhomPlayer,
    'tnd': TLMNDLPlayer
}

const maxPlayersMap = {
    [game.const.gameCode.PHOM]: 4,
    [game.const.gameCode.TLMNDL]: 4,
    [game.const.gameCode.TLMN]: 4,
    [game.const.gameCode.TLMNM]: 4,
    [game.const.gameCode.BA_CAY]: 8,
    [game.const.gameCode.BAU_CUA]: 6,
    [game.const.gameCode.XAM]: 4,
    [game.const.gameCode.XITO]: 5,
    [game.const.gameCode.LIENG]: 5,
}

class GameManager {
    constructor() {
    }

    createBoard(gameCode, room){
        const boardClass = this.getBoardClass(gameCode);
        return boardClass && new boardClass(room)
    }

    createPlayer(gameCode, user){
        const playerClass = this.getPlayerClass(gameCode);
        return playerClass && new playerClass(room)
    }

    getBoardClass(gameCode){
        return gameCodeToBoardClassMap[gameCode]
    }

    getPlayerClass(gameCode){
        return gameCodeToPlayerClassMap[gameCode]
    }

    getMaxPlayer(gameCode){
        return maxPlayersMap[gameCode];
    }
}

var gameManager = new GameManager();

export default gameManager;