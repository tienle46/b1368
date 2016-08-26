/**
 * Created by Thanh on 8/23/2016.
 */

var GameContext = require("GameContext")
var GameResource = require("GameResource")
var GameService = require("GameService")
var GameSystem = require("GameSystem")
var async = require("async");

var game = module.exports;

_loadConfig();
_initConst();
_setupGame();

game.async = async;


function _loadConfig() {

    game.config = {};

    game.config.zone = "XGame";
    game.config.debug = true;
    game.config.useSSL = false;
    game.config.host = "123.31.12.100";
    game.config.port = 8481;
}

function _initConst() {

    game.const = {};

    _initSceneNameConst();
    _initStringConst();
}

function _initSceneNameConst() {
    game.const.scene = {};
    game.const.scene.LOGIN_SCENE = "LoginScene"
    game.const.scene.REGISTER_SCENE = "RegisterScene"
    game.const.scene.GAME_SCENE = "GameScene"
}

function _initStringConst() {

    game.const.string = {};
    game.const.string.GAME_TITLE = "B1368"
}

function _setupGame() {
    game.context = GameContext.newInstance();
    game.resource = GameResource.newInstance();
    game.system = GameSystem.newInstance()
    game.service = GameService.newInstance();
}