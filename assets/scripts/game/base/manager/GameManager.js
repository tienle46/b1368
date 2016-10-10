/**
 * Created by Thanh on 8/27/2016.
 */

import app from 'app';
import {TLMNDLBoard, TLMNDLBoardRenderer} from 'game';
import {TLMNDLPlayer, TLMNDLPlayerRenderer} from 'game';


/***
 * Players
 * @type {{}}
 */

const playerClassMap = {
    [app.const.gameCode.TLMNDL]: TLMNDLPlayer
};

const playerRendererMap = {
    [app.const.gameCode.TLMNDL]: TLMNDLPlayerRenderer
};

const playerClassNameMap = {
    [app.const.gameCode.TLMNDL]: 'PlayerTLMNDL'
};

const playerRendererNameMap = {
    [app.const.gameCode.TLMNDL]: 'PlayerTLMNDLRenderer'
};

const playerPrefabPathMap = {
    [app.const.gameCode.TLMNDL]: 'game/players/TLMNDLPlayerPrefab'
};

/**
 * Boards
 * @type {{}}
 */

const boardClassMap = {
    [app.const.gameCode.TLMNDL]: TLMNDLBoard
};

const boardRendererMap = {
    [app.const.gameCode.TLMNDL]: TLMNDLBoardRenderer
};

const boardClassNameMap = {
    [app.const.gameCode.TLMNDL]: 'BoardTLMNDL'
};

const boardRendererNameMap = {
    [app.const.gameCode.TLMNDL]: 'BoardTLMNDLRenderer'
};

const boardPrefabPathMap = {
    [app.const.gameCode.TLMNDL]: 'game/boards/TLMNDLBoardPrefab'
};

/**
 * Controls
 *
 * @type {{}}
 */
const gameControlsClassMap = {
    [app.const.gameCode.TLMNDL]: 'TLMNDLControls'
};

const gameControlsPathMap = {
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
            }
        ], function (err, results) {

            let loadedRes = true;

            for (let success of results) {
                if (!success) {
                    loadedRes = false;
                    break;
                }
            }

            if (loadedRes) {
                cb && cb();
            } else {
                cb && cb(app.res.string('error.fail_to_create_game'));
            }

            console.log("results: ", results);
            console.log("err: ", err);
        });

    }

    createBoard(gameCode) {
        let boardClassName = boardClassNameMap[gameCode];
        let boardRendererClassName = boardRendererNameMap[gameCode];

        if (this.boardPrefab && boardClassName && boardRendererClassName) {
            let boardNode = cc.instantiate(this.boardPrefab);
            let board = boardNode.getComponent(boardClassName);
            board.setRenderer(boardNode.getComponent(boardRendererClassName));

            return {board: board, boardNode: boardNode};
        }
    }

    createPlayer(gameCode) {

        let playerClassName = playerClassNameMap[gameCode];
        let playerRendererClassName = playerRendererNameMap[gameCode];

        if(this.playerPrefab && playerClassName && playerRendererClassName){
            let playerNode = cc.instantiate(this.playerPrefab);
            let player = playerNode.getComponent(playerClassName);
            player.setRenderer(playerNode.getComponent(playerRendererClassName));

            return {player: player, playerNode: playerNode};
        }
    }

    createGameControls(scene, cb) {
        let gameControlsPath = gameControlsPathMap[scene.gameCode];
        let gameControlsClass = gameControlsClassMap[scene.gameCode];


        if (gameControlsPath && gameControlsClass) {
            cc.loader.loadRes(gameControlsPath, (error, prefab) => {
                let controlsNode = cc.instantiate(prefab);
                let gameControls = controlsNode.getComponent(gameControlsClass);
                cb(null, controlsNode, gameControls);
            });
        } else {
            cb({error: app.res.string('error.cannot_create_game_board')})
        }
    }

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