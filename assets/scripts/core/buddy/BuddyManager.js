/**
 * Created by Thanh on 1/20/2017.
 */

import app from 'app';
import SFS2X from 'SFS2X';
import * as Events from "../Events";

const MOOD_VARIABLE_NAME = SFS2X.Entities.Variables.SFSBuddyVariable.OFFLINE_PREFIX + "mood";
const PLAYING_GAME = "playingGame";

/**
 * Buddy => SFS2X.Entities.SFSBuddy => { id, name, blocked, temp, variables};
 *
 * Events will be emitting:
 *
 * Events.ON_BUDDY_LIST_INITED => (buddies: [Buddy], tmpBuddies: [Buddy])
 * Events.ON_BUDDY_MESSAGE => (message: String, isItMe: Boolean, buddy: Buddy) //isItMe == true => buddy = null, isItMe == false => buddy = Buddy(defined )};
 * Events.ON_BUDDY_ADDED => (buddy: Buddy)
 * Events.ON_BUDDY_REMOVED => (buddy: Buddy)
 * Events.ON_BUDDY_BLOCKED => (buddy: Buddy)
 * Events.ON_BUDDY_ONLINE_STATE_CHANGED => (isOnline: Boolean, isItMe: Boolean, buddy: SFS2X.Entities.SFSBuddy) //isItMe == true => buddy = null, isItMe == false => buddy = Buddy(defined)};
 * Events.ON_BUDDY_MOOD_CHANGED => (mood: String, isItMe: Boolean, buddy: Buddy) //isItMe == true => buddy = null, isItMe == false => buddy = Buddy(defined)};
 * Events.ON_BUDDY_CHANGE_PLAYING_GAME => (gameCode: String, gameName: String) // gameCode = null => Player không chơi ở game nào
 */

export default class BuddyManager {

    constructor() {
        this.buddies = [];
        this.tmpBuddies = [];
        this.sfsBuddyManager = app.service.client.buddyManager;

        this.initEventListener();
    }


    initEventListener() {
        this.removeEventListener();

        app.system.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_ADD, this._onBuddyAdd, this);
        app.system.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_REMOVE, this._onBuddyRemove, this);
        app.system.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_BLOCK, this._onBuddyBlock, this);
        app.system.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_ERROR, this._onBuddyError, this);
        app.system.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_MESSAGE, this._onBuddyMessage, this);
        app.system.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_LIST_INIT, this._onBuddyListInit, this);
        app.system.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_ONLINE_STATE_CHANGE, this._onBuddyOnlineStateChange, this);
        app.system.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_VARIABLES_UPDATE, this._onBuddyVariablesUpdate, this);
    }

    removeEventListener() {
        app.system.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_ADD, this._onBuddyAdd, this);
        app.system.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_REMOVE, this._onBuddyRemove, this);
        app.system.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_BLOCK, this._onBuddyBlock, this);
        app.system.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_ERROR, this._onBuddyError, this);
        app.system.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_MESSAGE, this._onBuddyMessage, this);
        app.system.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_LIST_INIT, this._onBuddyListInit, this);
        app.system.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_ONLINE_STATE_CHANGE, this._onBuddyOnlineStateChange, this);
        app.system.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_VARIABLES_UPDATE, this._onBuddyVariablesUpdate, this);
    }

    addBuddy(buddyName){
        buddyName && buddyName.length > 0 && app.service.sendRequest(new SFS2X.Requests.BuddyList.AddBuddyRequest(buddyName, true));
    }

    /**
     * This event using both case remove buddy from buddy list && temp buddy list
     * @param buddyName
     */
    removeBuddy(buddyName){
        buddyName && buddyName.length > 0 && app.service.sendRequest(new SFS2X.Requests.BuddyList.RemoveBuddyRequest(buddyName, true));
    }

    blockBuddy(buddyName, block = true){

        if(!buddyName || buddyName.length == 0) return;

        let buddy = this.getBuddyByName.getBuddyByName(buddyName);
        if(buddy){
            if(buddy.isOnline()){
                app.service.sendRequest(new SFS2X.Requests.BuddyList.BlockBuddyRequest(buddyName, block));
            }else{
                app.system.showToast(app.res.string('buddy_cannot_block_offline_buddy'));
            }
        }else{
            app.system.showToast(app.res.string('buddy_not_in_your_buddy_list', {buddyName}))
        }
    }

    sendMessage(message, toBuddyName){
        if(!message || message.length == 0 || !toBuddyName || toBuddyName.length == 0) return;

        let buddy = this.getBuddyByName.getBuddyByName(toBuddyName);
        if(buddy){
            app.service.sendRequest(new SFS2X.Requests.BuddyList.BuddyMessageRequest(message, buddy));
        } else {
            app.system.showToast(app.res.string('buddy_not_found_receiver_buddy'));
        }
    }

    setMood(moodStr){
        if(!moodStr || moodStr.length == 0) return;

        let mood = new SFS2X.Entities.Variables.SFSBuddyVariable(MOOD_VARIABLE_NAME, moodStr);
        app.service.sendRequest(new SFS2X.Requests.BuddyList.SetBuddyVariablesRequest([mood]));
    }

    goOffline(){
        if (this.sfsBuddyManager.getMyOnlineState()) {
            app.service.sendRequest(new SFS2X.Requests.BuddyList.GoOnlineRequest(false));
        }
    }

    getBuddyByName(name){
        return name && this.sfsBuddyManager.getBuddyByName(name);
    }

    _onBuddyAdd(evtParams){
        if(!evtParams.buddy.isTemp()){
            let index = this.tmpBuddies.indexOf(evtParams.buddy);
            index >= 0 && this.tmpBuddies.splice(index, 1);
        }
        this._addBuddyToList(evtParams.buddy);
        app.system.emit(Events.ON_BUDDY_ADDED, evtParams.buddy);
    }

    _addBuddyToList(buddy){
        if(buddy.isTemp()){
            this.tmpBuddies.push(buddy);
        }else{
            this.buddies.push(buddy);
        }
    }

    _onBuddyRemove(evtParams){
        let index = this.buddies.indexOf(evtParams.buddy);
        if(index > 0){
            this.buddies.splice(index, 1);
        }else{
            index = this.tmpBuddies.indexOf(evtParams.buddy);
            index >= 0 && this.buddies.splice(index, 1);
        }

        app.system.emit(Events.ON_BUDDY_REMOVED, evtParams.buddy);
    }

    _onBuddyBlock(evtParams){
        let isBlocked = evtParams.buddy.isBlocked();
        app.system.emit(Events.ON_BUDDY_BLOCKED, evtParams.buddy);
    }

    _onBuddyError(evtParams) {
        let message = this._getErrorMessageByCode(evtParams.errorCode);
        if(message){
            app.system.showToast(message);
        }
    }

    _getErrorMessageByCode(errorCode){
        let errorCodeStr = `${errorCode}`;
        let errorCodeMsg = errorCodeStr.length == 0 ? "" : app.res.string('error_code', {errorCode})
        switch(errorCodeStr){
            case '36':
            case '39':
                return app.res.string('buddy_undefined_error', {errorCode: errorCodeMsg});
            case '37':
                return app.res.string('buddy_buddy_list_is_full');
            case '38':
                return app.res.string('buddy_cannot_block_offline_buddy');
            default:
                return app.res.string('buddy_undefined_error', {errorCode: errorCodeMsg});
        }
    }

    _onBuddyMessage(evtParams){
        let isItMe = evtParams.isItMe;
        let sender = evtParams.buddy;
        let message = evtParams.message;

        app.system.emit(Events.ON_BUDDY_MESSAGE, message, isItMe, sender);
    }

    _onBuddyListInit(evtParams){
        this.buddies.length = 0;
        this.tmpBuddies.length = 0;

        evtParams.buddyList.forEach(buddy => this._addBuddyToList(buddy));
        app.system.emit(Events.ON_BUDDY_LIST_INITED, this.buddies, this.tmpBuddies);
    }

    _onBuddyOnlineStateChange(evtParams){
        let isItMe = evtParams.isItMe;
        let isOnline = isItMe ? this.sfsBuddyManager.getMyOnlineState() : evtParams.buddy.isOnline();
        app.system.emit(Events.ON_BUDDY_ONLINE_STATE_CHANGED, isOnline, isItMe, evtParams.buddy);
    }

    _onBuddyVariablesUpdate(evtParams){
        let isItMe = evtParams.isItMe;

        evtParams.changedVars.forEach((varName, i) => {
            let value = isItMe ? this.sfsBuddyManager.getMyVariable(varName).value
                : this.sfsBuddyManager.getBuddyByName(evtParams.buddy.name).getVariable(varName).value;

            if(varName == MOOD_VARIABLE_NAME){
                app.system.emit(Events.ON_BUDDY_MOOD_CHANGED, value || "", isItMe, evtParams.buddy);
            } else if(varName == PLAYING_GAME) {

                let gameCode = value == undefined || value.length == 0 ? undefined : value;
                let gameName = gameCode.length == 0 ? undefined : app.res.gameName[gameCode];

                app.system.emit(Events.ON_BUDDY_CHANGE_PLAYING_GAME, gameCode, gameName);
            } else {
                //TODO
            }
        })
    }
}