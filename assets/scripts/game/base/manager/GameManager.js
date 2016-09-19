/**
 * Created by Thanh on 8/27/2016.
 */

import app from 'app';
import TLMNDLBoard from 'TLMNDLBoard';
import TLMNDLPlayer from 'TLMNDLPlayer';


const gameCodeToBoardClassMap = {
    [app.const.gameCode.TLMNDL]: TLMNDLBoard
};

const gameCodeToPlayerClassMap = {
    [app.const.gameCode.TLMNDL]: TLMNDLPlayer
};

const maxPlayersMap = {
    [app.const.gameCode.PHOM]: 4,
    [app.const.gameCode.TLMNDL]: 4,
    [app.const.gameCode.TLMN]: 4,
    [app.const.gameCode.TLMNM]: 4,
    [app.const.gameCode.BA_CAY]: 8,
    [app.const.gameCode.BAU_CUA]: 6,
    [app.const.gameCode.XAM]: 4,
    [app.const.gameCode.XITO]: 5,
    [app.const.gameCode.LIENG]: 5,
};

class GameManager {
    constructor() {
    }

    createBoard(gameCode, room){
        const boardClass = this.getBoardClass(gameCode);
        return boardClass && new boardClass(room);
    }

    createPlayer(gameCode, user){
        const playerClass = this.getPlayerClass(gameCode);
        return playerClass && new playerClass(room);
    }

    getBoardClass(gameCode){
        return gameCodeToBoardClassMap[gameCode];
    }

    getPlayerClass(gameCode){
        return gameCodeToPlayerClassMap[gameCode];
    }

    getMaxPlayer(gameCode){
        return maxPlayersMap[gameCode];
    }
}

export default new GameManager();