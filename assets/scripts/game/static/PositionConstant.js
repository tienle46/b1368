/**
 * Created by Thanh on 8/26/2016.
 */

var game = require('game')

game.const.position = {}

game.const.position[game.const.seat.SEAT_TYPE_6_PLAYER] = {};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER] = {};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER_XITO] = {};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER] = {};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER_PHOM] = {};
game.const.position[game.const.seat.SEAT_TYPE_2_PLAYER] = {};


// --- SEAT_TYPE_6_PLAYER ---
game.const.position[game.const.seat.SEAT_TYPE_6_PLAYER].FIRST = {x: 395.25, y: 10};
game.const.position[game.const.seat.SEAT_TYPE_6_PLAYER].SECOND = {x: 666, y: 118};
game.const.position[game.const.seat.SEAT_TYPE_6_PLAYER].THIRD = {x: 666, y: 403};
game.const.position[game.const.seat.SEAT_TYPE_6_PLAYER].FOURTH = {x: 395.25, y: 440};
game.const.position[game.const.seat.SEAT_TYPE_6_PLAYER].FIFTH = {x: 100, y: 403};
game.const.position[game.const.seat.SEAT_TYPE_6_PLAYER].SIXTH = {x: 100, y: 118};

// --- SEAT_TYPE_5_PLAYER ---
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER].FIRST = {x: 200, y: 10};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER].SECOND = {x: 695, y: 160};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER].THIRD = {x: 477, y: 435};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER].FOURTH = {x: 293, y: 435};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER].FIFTH = {x: 75, y: 160};
// --XiTo --
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER_XITO].FIRST = {x: 395.25, y: 10};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER_XITO].SECOND = {x: 695, y: 160};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER_XITO].THIRD = {x: 507, y: 435};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER_XITO].FOURTH = {x: 263, y: 435};
game.const.position[game.const.seat.SEAT_TYPE_5_PLAYER_XITO].FIFTH = {x: 75, y: 160};

// --- SEAT_TYPE_4_PLAYER ---
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER].FIRST = {x: 200, y: 10};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER].SECOND = {x: 690, y: 160};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER].THIRD = {x: 610, y: 436};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER].FOURTH = {x: 90, y: 385};

// --Phom--
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER_PHOM].FIRST = {x: 200, y: 10};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER_PHOM].FIRST_NOT_MYSELF = {x: 384, y: 28};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER_PHOM].SECOND = {x: 755, y: 350};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER_PHOM].THIRD = {x: 384, y: 434};
game.const.position[game.const.seat.SEAT_TYPE_4_PLAYER_PHOM].FOURTH = {x: 10, y: 250};


// --- SEAT_TYPE_2_PLAYER ---
game.const.position[game.const.seat.SEAT_TYPE_2_PLAYER].FIRST = {/*x: 550, y: 285*/ x: 546, y: 56 };
game.const.position[game.const.seat.SEAT_TYPE_2_PLAYER].SECOND = {x: 546, y: 388};
