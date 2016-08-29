/**
 * Created by t420 on 11/2/13.
 */

var game = require("game")

game.const.rank = {}

game.const.rank.gameRankTypes = [
        2, 0, 0, 1,
        2, 0, 0, 0,
        0, 1, 1];

game.const.rank.GAME_RANK_TYPE_WIN_LOSE = 0;
game.const.rank.GAME_RANK_TYPE_WIN_DRAW_LOSE = 1;
game.const.rank.GAME_RANK_TYPE_FIRST_LAST = 2;

game.const.rank.GAME_RANK_FIRST = 1;
game.const.rank.GAME_RANK_SECOND = 2;
game.const.rank.GAME_RANK_THIRD = 3;
game.const.rank.GAME_RANK_FOURTH = 4;

game.const.rank.GAME_RANK_WIN = 1;
game.const.rank.GAME_RANK_DRAW = 2;
game.const.rank.GAME_RANK_LOSE = 0;

game.const.rank.getRankString = function(rankType, rank) {
    var retString = "";
    switch (rankType) {
        case game.const.rank.GAME_RANK_TYPE_WIN_DRAW_LOSE:
        case game.const.rank.GAME_RANK_TYPE_WIN_LOSE:
            if (rank == 1) {
                retString = "Thắng";
            } else if (rank == 2) {
                retString = "Hòa";
            } else if (rank == 0) {
                retString = "Thua";
            }
            break;
        case game.const.rank.GAME_RANK_TYPE_FIRST_LAST:
            if (rank == game.const.rank.GAME_RANK_FIRST) {
                retString = "Nhất";
            } else if (rank == game.const.rank.GAME_RANK_SECOND) {
                retString = "Nhì";
            } else if (rank == game.const.rank.GAME_RANK_THIRD) {
                retString = "Ba";
            } else if (rank == game.const.rank.GAME_RANK_FOURTH) {
                retString = "Bét";
            }
            break;
        default:
            break;

    }
    return retString;
};