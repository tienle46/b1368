/**
 * Created by Thanh on 8/23/2016.
 */

var GameContext = require("GameContext")
var GameResource = require("GameResource")
var GameService = require("GameService")
var GameSystem = require("GameSystem")

var game = module.exports;

game.const = {};
_initConst();

game.config = {};
_loadConfig();

game.context = GameContext.newInstance();
game.resource = GameResource.newInstance();
game.service = GameService.newInstance();
game.system = GameSystem.newInstance();

function _loadConfig() {
    game.config.zone = "XGame";
    game.config.debug = true;
    game.config.useSSL = false;
    game.config.host = "123.31.12.100";
    game.config.port = 8481;
}

function _initConst() {
    game.const.TITLE = "B1368"
}
