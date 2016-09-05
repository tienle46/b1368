/**
 * Created by Thanh on 8/23/2016.
 */

import game from 'game'

class GameContext {

    constructor() {
        this.currentRoom = null
        this.groupId = null
        this.currentRoom = null
        this.lastJoinedRoom = null
    }

    /**
     *
     * @returns {SFS2X.Entities.SFSUser}
     */
    getMySelf() {
        return game.service.client.me;
    }

    isJoinedGame(){
        return this.currentRoom && this.currentRoom.isGame
    }

    getRoom(roomId){
        return game.service.getClient().getRoomById(roomId);
    }
}

module.exports = new GameContext();