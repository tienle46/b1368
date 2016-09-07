import game from 'game';
import LOGIN_ERROR_MESSAGES from 'LoginErrorMessages';
import ROOM_ERROR_MESSAGES from 'RoomErrorMessages';

var MESSAGES = Object.assign({}, LOGIN_ERROR_MESSAGES, ROOM_ERROR_MESSAGES);

game.getMessageFromServer = (errorCode, errorMessage) => {
    return (typeof MESSAGES[errorCode] === 'object') ? MESSAGES[errorCode][errorMessage] : MESSAGES[errorCode];
}