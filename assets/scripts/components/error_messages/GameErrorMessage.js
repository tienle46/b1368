var LOGIN_ERROR_MESSAGES = require('LoginErrorMessages');
var ROOM_ERROR_MESSAGES = require('RoomErrorMessages');
var MESSAGES = {};

const VI_LANG = "vi";

MESSAGES[VI_LANG] = {...LOGIN_ERROR_MESSAGES[VI_LANG], ...ROOM_ERROR_MESSAGES[VI_LANG] };

module.exports = MESSAGES;