/**
 * Created by Thanh on 1/20/2017.
 */

import app from 'app';
import utils from 'utils';
import SFS2X from 'SFS2X';
import Events from "Events";

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
 * Events.ON_BUDDY_STATE_CHANGED => (isOnline: Boolean, isItMe: Boolean, buddy: SFS2X.Entities.SFSBuddy) //isItMe == true => buddy = null, isItMe == false => buddy = Buddy(defined)};
 * Events.ON_BUDDY_MOOD_CHANGED => (mood: String, isItMe: Boolean, buddy: Buddy) //isItMe == true => buddy = null, isItMe == false => buddy = Buddy(defined)};
 * Events.ON_BUDDY_CHANGE_PLAYING_GAME => (gameCode: String, gameName: String) // gameCode = null => Player không chơi ở game nào
 */

export default class BuddyManager {

    constructor() {
        this.buddies = [];
        this._requestedBuddies = [];
        this.tmpBuddies = [];
        this.blackBuddyNames = [];
        this.initEventListener();
        //this._initTestData();
    }

    reset() {
        this.removeEventListener();
        this.buddies = [];
        this.tmpBuddies = [];
        this.blackBuddyNames = [];
        this._requestedBuddies = [];
        this.initEventListener();
    }

    _initTestData() {
        // SFS2X.Entities.SFSBuddy = function (a, b, c, d) {
        //     this.id = a;
        //     this.name = b;
        //     this.blocked = null != c ? c : !1;
        //     this.temp = null != d ? d : !1;
        //     this.variables = {};
        // };

        let buddy = new SFS2X.Entities.SFSBuddy(1, "test1", false, false);
        let buddy2 = new SFS2X.Entities.SFSBuddy(1, "test2", false, false);
        buddy2.variables[SFS2X.Entities.Variables.ReservedBuddyVariables.BV_ONLINE] = true;

        this.buddies.push(buddy);
        this.buddies.push(buddy2);
        this.buddies.push(buddy);
        this.buddies.push(buddy2);
        this.buddies.push(buddy);
        this.buddies.push(buddy2);
        this.buddies.push(buddy);
        this.buddies.push(buddy2);
        this.buddies.push(buddy);
        this.buddies.push(buddy2);
        this.buddies.push(buddy);
        this.buddies.push(buddy2);
        this.buddies.push(buddy);
        this.buddies.push(buddy2);
    }

    initEventListener() {
        this.removeEventListener();

        app.system.addListener(SFS2X.SFSBuddyEvent.BUDDY_ADD, this._onBuddyAdd, this);
        app.system.addListener(SFS2X.SFSBuddyEvent.BUDDY_REMOVE, this._onBuddyRemove, this);
        app.system.addListener(SFS2X.SFSBuddyEvent.BUDDY_BLOCK, this._onBuddyBlock, this);
        app.system.addListener(SFS2X.SFSBuddyEvent.BUDDY_ERROR, this._onBuddyError, this);
        app.system.addListener(SFS2X.SFSBuddyEvent.BUDDY_MESSAGE, this._onBuddyMessage, this);
        app.system.addListener(SFS2X.SFSBuddyEvent.BUDDY_LIST_INIT, this._onBuddyListInit, this);
        app.system.addListener(SFS2X.SFSBuddyEvent.BUDDY_ONLINE_STATE_CHANGE, this._onBuddyOnlineStateChange, this);
        app.system.addListener(SFS2X.SFSBuddyEvent.BUDDY_VARIABLES_UPDATE, this._onBuddyVariablesUpdate, this);
        app.system.addListener(app.commands.CONFIRM_ADD_BUDDY, this._confirmAddBuddy, this);
        app.system.addListener(app.commands.REQUEST_BUDDY, this._requestBuddyResponse, this);
    }

    removeEventListener() {
        app.system.removeListener(SFS2X.SFSBuddyEvent.BUDDY_ADD, this._onBuddyAdd, this);
        app.system.removeListener(SFS2X.SFSBuddyEvent.BUDDY_REMOVE, this._onBuddyRemove, this);
        app.system.removeListener(SFS2X.SFSBuddyEvent.BUDDY_BLOCK, this._onBuddyBlock, this);
        app.system.removeListener(SFS2X.SFSBuddyEvent.BUDDY_ERROR, this._onBuddyError, this);
        app.system.removeListener(SFS2X.SFSBuddyEvent.BUDDY_MESSAGE, this._onBuddyMessage, this);
        app.system.removeListener(SFS2X.SFSBuddyEvent.BUDDY_LIST_INIT, this._onBuddyListInit, this);
        app.system.removeListener(SFS2X.SFSBuddyEvent.BUDDY_ONLINE_STATE_CHANGE, this._onBuddyOnlineStateChange, this);
        app.system.removeListener(SFS2X.SFSBuddyEvent.BUDDY_VARIABLES_UPDATE, this._onBuddyVariablesUpdate, this);
        app.system.removeListener(app.commands.CONFIRM_ADD_BUDDY, this._confirmAddBuddy, this);
        app.system.removeListener(app.commands.REQUEST_BUDDY, this._requestBuddyResponse, this);
    }

    shouldRequestBuddy(buddyName){
        return this._requestedBuddies.indexOf(buddyName) < 0 && !this.getBuddyByName(buddyName);
    }

    _requestBuddyResponse(data) {
        let message = data && data[app.keywords.RESPONSE_MESSAGE];
        message && app.system.showToast(message);
    }

    requestAddBuddy(buddyName) {
        if (!buddyName) return;

        if (this.getBuddyByName(buddyName)) {
            app.system.showToast(app.res.string('buddy_already_in_buddy_list', { buddyName }));
        } else {
            if(app._.includes(this._requestedBuddies, buddyName)){
                app.system.showToast(app.res.string('buddy_request_already_send', { buddyName }));
                return;
            }

            this._requestedBuddies.push(buddyName);
            app.service.send({ cmd: app.commands.REQUEST_BUDDY, data: { buddyName } });
            app.system.showToast(app.res.string('buddy_request_already_send', { buddyName }))
        }
    }

    _confirmAddBuddy(data) {
        if (data && data.sender) {
            app.system.confirm(app.res.string('confirm_add_to_buddy_list', { sender: data.sender }), null, () => {
                app.service.send({ cmd: app.commands.CONFIRM_ADD_BUDDY, data: { sender: data.sender } });
            });
        }
    }

    getAllBuddy() {
        return app.service.client.buddyManager.getBuddyList();
    }

    containsBuddy(buddyName) {
        return app.service.client.buddyManager.containsBuddy(buddyName);
    }

    destroy() {
        this.removeEventListener();
        window.release([this.buddies, this.tmpBuddies, this.blackBuddyNames], true);
    }

    isBuddy(name) {
        return name && this.getBuddyByName(name);
    }

    sendInitBuddy() {
        !app.service.client.buddyManager.isInited() && app.service.send({ cmd: app.commands.BUDDY_INIT_LIST, data: {} });
    }

    addBuddy(buddyName) {
        buddyName && buddyName.length > 0 && app.service.sendRequest(new SFS2X.Requests.BuddyList.AddBuddyRequest(buddyName, true));
    }

    /**
     * This event using both case remove buddy from buddy list && temp buddy list
     * @param buddy
     */
    removeBuddy(buddy) {
        buddy && app.service.sendRequest(new SFS2X.Requests.BuddyList.RemoveBuddyRequest(buddy.name));
    }

    blockBuddy(buddy) {
        if (buddy) {
            if (buddy.isOnline()) {
                app.service.sendRequest(new SFS2X.Requests.BuddyList.BlockBuddyRequest(buddy.name, true));
            } else {
                app.system.showToast(app.res.string('buddy_cannot_block_offline_buddy'));
            }
        }
    }

    unblockBuddy(buddy) {
        if (buddy) {
            if (buddy.isOnline() || buddy.isBlocked()) {
                app.service.sendRequest(new SFS2X.Requests.BuddyList.BlockBuddyRequest(buddy.name, false));
            } else {
                app.system.showToast(app.res.string('buddy_cannot_block_offline_buddy'));
            }
        }
    }

    sendMessage(message, toBuddyName) {
        if (!message || message.length == 0 || !toBuddyName || toBuddyName.length == 0) return;

        let buddy = this.getBuddyByName(toBuddyName);
        // if(!buddy){
        //     app.buddyManager.addBuddy(toBuddyName);
        // }
        if (buddy) {
            let msgObj = { toBuddy: toBuddyName, message }
            app.service.sendRequest(new SFS2X.Requests.BuddyList.BuddyMessageRequest(JSON.stringify(msgObj), buddy));
            //app.service.sendRequest(new SFS2X.Requests.BuddyList.BuddyMessageRequest(message, buddy));
        } else {
            app.system.showToast(app.res.string('buddy_not_found_receiver_buddy'));
        }
    }

    onBuddyListUpdate() {
        this.buddies.splice(0, this.buddies.length);
        app.service.client.buddyManager.getBuddyList().forEach(buddy => this._addBuddyToList(buddy));
        app.system.emit(Events.ON_BUDDY_LIST_UPDATE);
    }

    filterBuddies(str) {
        return !str ? this.buddies : this.buddies.filter(buddy => buddy.name.startsWith(str));
    }

    setMood(moodStr) {
        if (!moodStr || moodStr.length == 0) return;

        let mood = new SFS2X.Entities.Variables.SFSBuddyVariable(BuddyManager.MOOD_VARIABLE_NAME, moodStr);
        app.service.sendRequest(new SFS2X.Requests.BuddyList.SetBuddyVariablesRequest([mood]));
    }

    goOffline() {
        if (app.service.client.buddyManager.getMyOnlineState()) {
            app.service.sendRequest(new SFS2X.Requests.BuddyList.GoOnlineRequest(false));
        }
    }

    getBuddyByName(name) {
        return name && app.service.client.buddyManager.getBuddyByName(name);
    }

    _onBuddyAdd(evtParams) {
        log('_onBuddyAdd: ', evtParams);
        if (evtParams.buddy) {
            this.onBuddyListUpdate();
            app.system.showToast(app.res.string("buddy_added_buddy", { buddyName: evtParams.buddy.name }))
        }

        // if(!evtParams.buddy.isTemp()){
        //     let index = this.tmpBuddies.indexOf(evtParams.buddy);
        //     index >= 0 && this.tmpBuddies.splice(index, 1);
        // }
        // this._addBuddyToList(evtParams.buddy);
        // app.system.emit(Events.ON_BUDDY_LIST_UPDATE, evtParams.buddy);
    }

    _addBuddyToList(buddy) {
        if (buddy.isTemp()) {
            this.tmpBuddies.push(buddy);
        } else {
            this.buddies.push(buddy);
        }
    }

    _onBuddyRemove(evtParams) {
        log('_onBuddyRemove: ', evtParams);
        if (evtParams.buddy) {
            this.onBuddyListUpdate();
            app.system.showToast(app.res.string("buddy_removed_buddy", { buddyName: evtParams.buddy.name }))
        }

        // let index = this.buddies.indexOf(evtParams.buddy);
        // if(index >= 0){
        //     this.buddies.splice(index, 1);
        // }else{
        //     index = this.tmpBuddies.indexOf(evtParams.buddy);
        //     index >= 0 && this.tmpBuddies.splice(index, 1);
        // }
        //
        // app.system.emit(Events.ON_BUDDY_LIST_UPDATE, evtParams.buddy);
    }

    _onBuddyBlock(evtParams) {
        app.system.emit(Events.ON_BUDDY_BLOCK_STATE_CHANGE, evtParams.buddy);
    }

    _onBuddyError(evtParams) {
        let message = this._getErrorMessageByCode(evtParams.errorCode);
        if (message) {
            app.system.showToast(message);
        }
    }

    _getErrorMessageByCode(errorCode) {
        let errorCodeStr = `${errorCode}`;
        let errorCodeMsg = errorCodeStr.length == 0 ? "" : app.res.string('error_code', { errorCode })
        switch (errorCodeStr) {
            case '36':
            case '39':
                return app.res.string('buddy_undefined_error', { errorCode: errorCodeMsg });
            case '37':
                return app.res.string('buddy_buddy_list_is_full');
            case '38':
                return app.res.string('buddy_cannot_block_offline_buddy');
            default:
                return app.res.string('buddy_undefined_error', { errorCode: errorCodeMsg });
        }
    }

    _onBuddyMessage(evtParams) {
        let msgObj;
        try {
            msgObj = JSON.parse(evtParams.message);
        } catch (e) {
            return;
        }

        let isItMe = evtParams.isItMe;
        let sender = isItMe ? app.context.getMe().name : evtParams.buddy && evtParams.buddy.name;
        let message = msgObj.message;
        let toBuddy = msgObj.toBuddy;

        // if (isItMe) {
        //     app.system.emit(Events.ON_BUDDY_MESSAGE, sender, toBuddy, message, isItMe);
        //     return;
        // }

        let buddy = this.getBuddyByName(isItMe ? toBuddy : sender);
        if (buddy && !buddy.isTemp()) {

            if (!buddy.messages)(buddy.messages = []);

            buddy.messages.push({ sender, message });
            if (buddy.messages.length > app.const.NUMBER_MESSAGES_KEEP_PER_BUDDY) {
                buddy.messages.shift();
            }

            if (buddy.hasOwnProperty('newMessageCount')) {
                buddy.newMessageCount = buddy.newMessageCount + 1;
            } else {
                buddy.newMessageCount = 1;
            }

            if (!this.findBuddyInList(app.context.chattingBuddies, buddy)) {
                app.context.chattingBuddies.push(buddy);
            }

            !isItMe && app.context.addToUnreadMessageBuddies(sender);
            app.system.emit(Events.ON_BUDDY_MESSAGE, sender, toBuddy, message, isItMe);

        } else {
            if (!sender && message.startsWith('sender=')) {
                let senderName = message.substr('sender='.length, message.length);
                if (this.blackBuddyNames.indexOf(senderName) < 0) {
                    app.system.confirm(app.res.string('confirm_add_to_buddy_list', { sender: senderName }), null, () => {
                        this.addBuddy(senderName);
                    });
                    this.blackBuddyNames.push(senderName);
                }
            }
        }

    }

    findBuddyInList(buddies, findingBuddy) {
        if (!buddies || !(buddies instanceof Array) || !findingBuddy) return;

        let findBuddy;
        buddies.some(buddy => {
            if (buddy.name == findingBuddy.name) {
                findBuddy = buddy;
                return true;
            }
        });

        return findBuddy;
    }

    _onBuddyListInit(evtParams) {
        window.release(this.buddies, this.tmpBuddies);

        evtParams.buddyList.forEach(buddy => this._addBuddyToList(buddy));
        app.system.emit(Events.ON_BUDDY_LIST_INITED, this.buddies, this.tmpBuddies);
    }

    _onBuddyOnlineStateChange(evtParams) {
        let isItMe = evtParams.isItMe;
        let isOnline = isItMe ? app.service.client.buddyManager.getMyOnlineState() : evtParams.buddy.isOnline();
        app.system.emit(Events.ON_BUDDY_ONLINE_STATE_CHANGED, isOnline, isItMe, evtParams.buddy);
    }

    _onBuddyVariablesUpdate(evtParams) {
        let isItMe = evtParams.isItMe;

        evtParams.changedVars.forEach((varName, i) => {
            let value = isItMe ? utils.getVariable(app.service.client.buddyManager, varName):
                utils.getVariable(app.service.client.buddyManager.getBuddyByName(evtParams.buddy.name), varName);

            if (varName == BuddyManager.MOOD_VARIABLE_NAME) {
                app.system.emit(Events.ON_BUDDY_MOOD_CHANGED, value || "", isItMe, evtParams.buddy);
            } else if (varName == BuddyManager.PLAYING_GAME_ROOM) {
                app.system.emit(Events.ON_BUDDY_CHANGE_PLAYING_GAME, isItMe, evtParams.buddy);
            } else {
                //TODO
            }
        });
    }
}

BuddyManager.MOOD_VARIABLE_NAME = SFS2X.Entities.Variables.SFSBuddyVariable.OFFLINE_PREFIX + "mood";
BuddyManager.PLAYING_GAME_ROOM = "gr";