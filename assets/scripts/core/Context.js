/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import Events from 'Events';
import RubUtils from 'RubUtils';
import Utils from 'Utils';
import VisibilityManager from 'VisibilityManager';

/**
 * Make sure that System.js require before
 */
class GameContext {

    constructor() {
        this.groupId = null;
        this.currentRoom = null;
        this.lastJoinedRoom = null;
        this.rejoiningGame = false;
        this.selectedGame = null; // selected game code
        this.unreadMessageBuddies = []; // buddies unreaded messages 
        this.chattingBuddies = []; // buddies chatting ...
        this.personalMessagesCount = 0;
        this.gameList = []; // selected game code
        this.requestRandomInvite = undefined; //In rejoin game case GameScene not asign to false when requestRandomInvite == undefined
        this.ctl = null;
        this.systemMessageCount = 0;
        this.newVersionInfo = null;

        this._addContextEventListener()
    }

    _addContextEventListener(){
        app.system.addListener(app.commands.NEW_NOTIFICATION_COUNT, this._onNotifyCount, this);
        app.system.addListener(app.commands.USER_MSG_COUNT, this._setChangePersonalMessageCount, this);
        app.system.addListener(Events.CHANGE_SYSTEM_MESSAGE_COUNT, this._changeSystemMessageCount, this, 0);
        app.system.addListener(Events.CHANGE_PERSONAL_MESSAGE_COUNT, this._changePersonalMessageCount, this, 0);
    }

    _onNotifyCount(data) {
        let {sysMsgCount, userMsgCount} = data;
        this.systemMessageCount = app.visibilityManager.isActive(VisibilityManager.SYSTEM_MESSAGE) ? Math.max(sysMsgCount, 0) : 0;
        this.personalMessagesCount = Math.max(userMsgCount, 0);

        app.system.emit(Events.ON_MESSAGE_COUNT_CHANGED);
    }

    getTotalMessageCount(){
        return this.systemMessageCount + this.personalMessagesCount
    }

    _setChangePersonalMessageCount(data){
        this._changePersonalMessageCount(data.count, true)
    }

    _changeSystemMessageCount(count = 0, isReplace = false){
        if(app.visibilityManager.isActive(VisibilityManager.SYSTEM_MESSAGE)) {
            if(isReplace){
                this.systemMessageCount = Math.max(count, 0);
            }else{
                this.systemMessageCount = Math.max(this.systemMessageCount + count);
            }

            app.system.emit(Events.ON_MESSAGE_COUNT_CHANGED);
        }
    }

    _changePersonalMessageCount(count = 0, isReplace = false){
        if(isReplace){
            this.personalMessagesCount = Math.max(count, 0);
        }else{
            this.personalMessagesCount = Math.max(this.personalMessagesCount + count);
        }

        app.system.emit(Events.ON_MESSAGE_COUNT_CHANGED);
    }

    reset() {
        this.chattingBuddies = [];
        this.unreadMessageBuddies = [];
        this.systemMessageCount = 0;
        this.personalMessagesCount = 0;
        this.lastJoinedRoom = null;
        this.currentRoom = null;
        this.groupId = null;
    }

    addToChattingBuddies(buddy) {
        if (!app.buddyManager.findBuddyInList(this.chattingBuddies, buddy)) {
            this.chattingBuddies.push(buddy);
        }
    }

    getUnreadMessageBuddyCount(){
        return this.unreadMessageBuddies.length
    }

    addToUnreadMessageBuddies(buddyName) {
        if (!buddyName) return;

        let index = this.unreadMessageBuddies.findIndex(message => message.buddyName === buddyName);
        if (index < 0) {
            this.unreadMessageBuddies.push({buddyName, count: 1});
            app.system.emit(Events.ON_BUDDY_UNREAD_MESSAGE_COUNT_CHANGED, this.unreadMessageBuddies.length);
        } else {
            this.unreadMessageBuddies[index].count += 1;
        }
    }

    removeUnreadMessageBuddies(buddyName) {
        let index = this.unreadMessageBuddies.findIndex(message => message.buddyName === buddyName);
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

    getVipLevel() {
        let me = this.getMe();
        let vipLevel = Utils.getVariable(me, app.keywords.VIP_LEVEL, {});

        return vipLevel.value || 0;
    }

    getMyInfo() {
        let me = this.getMe();
        let vipLevel =  Utils.getVariable(me, app.keywords.VIP_LEVEL, {});
        return me ? {
            "id": me.id,
            "isItMe": me.isItMe,
            "name": me.name,
            "coin": Utils.getVariable(me, 'coin', 0),
            "level": me.variables.lv,
            "avatar": Utils.getVariable(me, 'avatar', {}),
            "displayName": Utils.getVariable(me, 'displayName', me.name),
            "vipLevel": vipLevel.name || "Dân thường"
        } : {};
    }

    isVip() {
        let info = this.getMyInfo();
        return info.vipLevel && info.vipLevel !== "" && info.vipLevel !== "Dân thường";
    }

    /**
     *
     * @param {any} spriteComponent
     * @param {string} [type='thumb'] 'thumb' || 'large'|| 'tiny'
     *
     * @memberof GameContext
     */
    getMyAvatar(spriteComponent, type = 'thumb') {
        let avatar = app.context.getMyInfo()['avatar'];
        let validType = app._.includes(['thumb', 'large', 'tiny'], type) ? type : 'thumb';
        let url = (avatar && avatar[validType]) || this.getDefaultAvatarURL(validType);
        this.loadUserAvatarByURL(url, spriteComponent);
    }

    getDefaultAvatarURL(type) {
        return (typeof app.config.defaultAvatarUrl === 'object') ? app.config.defaultAvatarUrl[type] : app.config.defaultAvatarUrl;
    }

    loadUserAvatarByURL(url, spriteComponent, cb) {
        if(!url || !spriteComponent)
            return;

        spriteComponent.node && spriteComponent.node.parent && (spriteComponent.node.parent.opacity = 0);

        RubUtils.loadSpriteFrame(spriteComponent, url, null, true, (spriteComp) => {
            if(spriteComp && spriteComp.node.parent) {
                let defaultSprite = spriteComp.node.parent.getComponent(cc.Sprite);
                spriteComp.node.parent.opacity = 255;
                defaultSprite && (defaultSprite.spriteFrame = spriteComp.spriteFrame);
            }

            cb && cb(spriteComp);
        });
    }

    getMeBalance() {
        let me = this.getMe();
        return (me && me.variables.coin && me.variables.coin.value) || 0;
    }

    getMeDisplayName() {
        let me = this.getMe()

        if(me){
            let displayName = me.variables.displayName && me.variables.displayName.value && me.variables.displayName.value.trim()
            if(displayName && displayName.length > 0){
                if(displayName.length > 12){
                    displayName = displayName.substr(0, 12) + '...'
                }
                return displayName
            }else{
                return me.name
            }
        }

        return "";
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

    setCtlData(data) {
        this.ctl = data;
    }
}

const context = new GameContext()
module.exports = context;