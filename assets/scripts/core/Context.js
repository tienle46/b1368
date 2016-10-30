/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';

class GameContext {

    constructor() {
        this.currentRoom = null;
        this.groupId = null;
        this.currentRoom = null;
        this.lastJoinedRoom = null;
        this.rejoiningGame = false;
    }

    /**
     *
     * @returns {SFS2X.Entities.SFSUser}
     */
    getMe() {
        return app.service.client.me;
    }

    getMyInfo() {
        let me = this.getMe();
        if (me) {
            let user = {
                "id": me.id,
                "isItMe": me.isItMe,
                "name": me.name,
                "coin": me.variables.coin && (me.variables.coin.value || 0),
                "level": me.variables.lv
            };
            return user;
        }
        return null;
    }

    isJoinedGame() {
        return this.currentRoom && this.currentRoom.isGame;
    }

    isJoinedInGameRoom(roomId) {
        return this.currentRoom && this.currentRoom.isGame && roomId == this.currentRoom.id;
    }

    getRoom(roomId) {
        return app.service.getClient().getRoomById(roomId);
    }

    needUpdatePhoneNumber() {
        return this.getMe()[app.keywords.UPDATE_PHONE_NUMBER];
    }
}

module.exports = new GameContext();