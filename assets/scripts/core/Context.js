/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import Events from 'Events';

class GameContext {

    constructor() {
        this.groupId = null;
        this.currentRoom = null;
        this.lastJoinedRoom = null;
        this.rejoiningGame = false;
        this.selectedGame = null; // selected game code
        this.purchaseItems = []; // stringifyJSON array : [{id, receipt, username}]
        this.unreadMessageBuddies = []; // selected game code
        this.chattingBuddies = []; // selected game code
        this.gameList = []; // selected game code
        this.requestRandomInvite = undefined; //In rejoin game case GameScene not asign to false when requestRandomInvite == undefined
    }

    reset() {
        this.chattingBuddies = [];
        this.unreadMessageBuddies = [];
    }

    getPurchases() {
        let username = this.getMyInfo() ? this.getMyInfo().name : null;
        if (username)
            return this.purchaseItems.filter(item => item.username = username) || [];
        return this.purchaseItems || [];
    }

    /**
     * @param {Array} purchases
     * 
     * @memberOf GameContext
     */
    setPurchases(purchases) {
        this.purchaseItems = purchases;
    }

    addToChattingBuddies(buddy) {
        if (!app.buddyManager.findBuddyInList(this.chattingBuddies, buddy)) {
            this.chattingBuddies.push(buddy);
        }
    }

    addToUnreadMessageBuddies(buddyName) {
        if (!buddyName) return;

        let index = this.unreadMessageBuddies.indexOf(buddyName);
        if (index < 0) {
            this.unreadMessageBuddies.push(buddyName);
            app.system.emit(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this.unreadMessageBuddies.length);
        }
    }

    removeUnreadMessageBuddies(buddyName) {
        let index = this.unreadMessageBuddies.indexOf(buddyName);
        if (index >= 0) {
            this.unreadMessageBuddies.splice(index, 1);
            app.system.emit(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this.unreadMessageBuddies.length);
        }
    }

    setSelectedGame(selectedGame) {
        this.selectedGame = selectedGame;
    }

    getSelectedGame() {
        return this.selectedGame;
    }

    getLastJoinedRoom() {
        return this.lastJoinedRoom;
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

        return me ? {
            "id": me.id,
            "isItMe": me.isItMe,
            "name": me.name,
            "coin": (me.variables.coin && me.variables.coin.value) || 0,
            "level": me.variables.lv
        } : null;
    }

    getMeBalance() {
        let me = this.getMe();
        return (me && me.variables.coin && me.variables.coin.value) || 0;
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
        console.debug('this.getMe()', this.getMe());
        return this.getMe()[app.keywords.UPDATE_PHONE_NUMBER];
    }
}

const context = new GameContext()
module.exports = context;