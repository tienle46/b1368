/**
 * Created by Thanh on 8/27/2016.
 */

import app from 'app';
import TLMNDLControls from 'TLMNDLControls';
import PlayerTLMNDLRenderer from 'PlayerTLMNDLRenderer';
import PlayerTLMNDL from 'PlayerTLMNDL';
import BoardTLMNDL from 'BoardTLMNDL';
import BoardTLMNDLRenderer from 'BoardTLMNDLRenderer';


/***
 * Players
 * @type {{}}
 */

const playerClassMap = {
    [app.const.gameCode.TLMNDL]: PlayerTLMNDL
};

const playerRendererMap = {
    [app.const.gameCode.TLMNDL]: PlayerTLMNDLRenderer
};


/**
 * Boards
 * @type {{}}
 */
const boardClassMap = {
    [app.const.gameCode.TLMNDL]: BoardTLMNDL
};

const boardRendererMap = {
    [app.const.gameCode.TLMNDL]: BoardTLMNDLRenderer
};

/**
 * Controls
 *
 * @type {{}}
 */
const gameControlsClassMap = {
    [app.const.gameCode.TLMNDL]: TLMNDLControls
};

const gameControlsPrefabPathMap = {
    [app.const.gameCode.TLMNDL]: 'game/controls/TLMNDLControlsPrefab'
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

export default class GameManager {
    constructor() {

        this.boardPrefab = {
            default: null,
            type: cc.Prefab
        }

        this.playerPrefab = {
            default: null,
            type: cc.Prefab
        }

        this.gameControlPrefab = {
            default: null,
            type: cc.Prefab
        }
    }

    loadRes(gameCode, cb) {
        app.async.parallel([
            (callback) => {
                let boardPath = boardPrefabPathMap[gameCode];
                
                cc.loader.loadRes(boardPath, (error, prefab) => {
                    if (prefab) {
                        this.boardPrefab = prefab;
                        callback(null, true);
                    } else {
                        callback();
                    }
                });
            },
            (callback) => {
                let playerPath = playerPrefabPathMap[gameCode];
                cc.loader.loadRes(playerPath, (error, prefab) => {
                    if (prefab) {
                        this.playerPrefab = prefab;
                        callback(null, true);
                    } else {
                        callback();
                    }
                });
            },
            (callback) => {
                let playerPath = gameControlsPrefabPathMap[gameCode];
                cc.loader.loadRes(playerPath, (error, prefab) => {
                    if (prefab) {
                        this.gameControlPrefab = prefab;
                        callback(null, true);
                    } else {
                        callback();
                    }
                });
            }
        ], function (err, results) {

            let loadedRes = true;

            for (let success of results) {
                if (!success) {
                    loadedRes = false;
                    break;
                }
            }

            log("results: ", results);
            log("err: ", err);

            if (loadedRes) {
                cb && cb();
            } else {
                cb && cb(app.res.string('error.fail_to_create_game'));
            }

        });

    }

    // createBoard(gameCode) {
    //     let boardClassName = boardClassNameMap[gameCode];
    //     let boardRendererClassName = boardRendererNameMap[gameCode];
    //
    //     if (this.boardPrefab && boardClassName && boardRendererClassName) {
    //         let boardNode = cc.instantiate(this.boardPrefab);
    //         let board = boardNode.getComponent(boardClassName);
    //         board.setRenderer(boardNode.getComponent(boardRendererClassName));
    //
    //         return {board: board, boardNode: boardNode};
    //     }
    // }
    //
    // createPlayer(gameCode) {
    //
    //     console.log("createPlayer: ", gameCode);
    //
    //     let playerClass = playerClassMap[gameCode];
    //     let playerRendererClassName = playerRendererNameMap[gameCode];
    //
    //     if(this.playerPrefab && playerClass && playerRendererClassName){
    //         let playerNode = cc.instantiate(this.playerPrefab);
    //         let player = playerNode.getComponent(playerClass);
    //         player.setRenderer(playerNode.getComponent(playerRendererClassName));
    //
    //         return {player: player, playerNode: playerNode};
    //     }
    // }
    //
    // createGameControls(gameCode) {
    //     let gameControlsClass = gameControlsClassMap[gameCode];
    //
    //     if(this.gameControlPrefab && gameControlsClass){
    //         let gameControlsNode = cc.instantiate(this.gameControlPrefab);
    //         let gameControls = gameControlsNode.getComponent(gameControlsClass.name);
    //
    //         return {gameControls: gameControls, gameControlsNode: gameControlsNode};
    //     }
    // }

    getBoardClass(gameCode) {
        return boardClassMap[gameCode];
    }

    getPlayerClass(gameCode) {
        return playerClassMap[gameCode];
    }

    getMaxPlayer(gameCode) {
        return maxPlayersMap[gameCode];
    }
}