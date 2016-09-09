/**
 * Created by Thanh on 8/23/2016.
 */

var game = require('game')

game.resource = {};

game.resource.string = {};
game.resource.string.GAME_TITLE = "B1368";
game.resource.string.SYSTEM = "Hệ thống";


game.resource.getErrorMessage = function(key) {

}

game.resource.playerAnchorPath = {
    4: "game/players/FourPlayerPositions",
    5: "game/players/FivePlayerPositions",
    6: "game/players/SixPlayerPositions",
    8: "game/players/EightPlayerPositions",
}

game.resource.playerAnchorName = {
    4: "FourPlayerPositions",
    5: "FivePlayerPositions",
    6: "SixPlayerPositions",
    8: "EightPlayerPositions",
}