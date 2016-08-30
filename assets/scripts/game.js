/**
 * Created by Thanh on 8/23/2016.
 */

var game = module.exports;

game.const = {}
game.async = require("async");
game.resource = require("GameResource");
game.keywords = require("Keywords");
game.commands = require("Commands");

_loadConfig();
_initConst();
_initResource()
_setupGame();

function _loadConfig() {
    game.config = {};
    game.config.zone = "XGame";
    game.config.debug = true;
    game.config.useSSL = false;
    game.config.host = "123.31.12.100";
    game.config.port = 8481;
}

function _initConst() {
    _initSceneNameConst();
}

function _initSceneNameConst() {
    game.const.scene = {};
    game.const.scene.LOGIN_SCENE = "LoginScene";
    game.const.scene.REGISTER_SCENE = "RegisterScene";
    game.const.scene.DASHBOARD_SCENE = "DashboardScene";
    game.const.scene.GAME_SCENE = "GameScene";
}

function _initResource() {
    game.resource.string = {};
    game.resource.string.GAME_TITLE = "B1368";
    game.resource.string.SYSTEM = "Hệ thống";
}

function _setupGame() {
    require('PreLoader')
    game.service = require("GameService");
    game.system = require("GameSystem");
    game.context = require("GameContext");
    game.manager = require("GameManager");
}