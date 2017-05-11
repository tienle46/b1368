/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import Events from 'Events';
import RubUtils from 'RubUtils';
import Utils from 'Utils';

class GameContext {

    constructor() {
        this.groupId = null;
        this.currentRoom = null;
        this.lastJoinedRoom = null;
        this.rejoiningGame = false;
        this.selectedGame = null; // selected game code
        this.purchaseItems = []; // stringifyJSON array : [{id, receipt, username}]
        this.unreadMessageBuddies = []; // buddies unreaded messages 
        this.chattingBuddies = []; // buddies chatting ...
        this.gameList = []; // selected game code
        this.requestRandomInvite = undefined; //In rejoin game case GameScene not asign to false when requestRandomInvite == undefined
        this.ctl = null; 
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
            "vipLevel": vipLevel.name || "Phổ thông"
        } : {};
    }
    
    isVip() {
        let info = this.getMyInfo();
        return info.vipLevel && info.vipLevel !== "" && info.vipLevel !== "Phổ thông";   
    }
    
    getUserAvatar(spriteComponent, isThumb = false) {
        let url = app.context.getMyInfo()['avatar'][isThumb ? 'thumb' : 'large'] ? app.context.getMyInfo()['avatar'][isThumb ? 'thumb' : 'large'] : app.config.defaultAvatarUrl;
        this.loadUserAvatarByURL(url, spriteComponent);
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