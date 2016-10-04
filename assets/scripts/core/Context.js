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

    isJoinedGame(){
        return this.currentRoom && this.currentRoom.isGame;
    }

    isJoinedInGameRoom(roomId){
        return this.currentRoom && this.currentRoom.isGame && roomId == this.currentRoom.id;
    }

    getRoom(roomId){
        return app.service.getClient().getRoomById(roomId);
    }
}

module.exports = new GameContext();