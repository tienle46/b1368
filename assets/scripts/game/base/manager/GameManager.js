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

export default class GameManager {
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
}