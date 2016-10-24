/**
 * Created by Thanh on 8/23/2016.
 */

var app = require('app');
var SFS2X = require('SFS2X');
var Fingerprint2 = require('fingerprinter');
import AlertPopupRub from 'AlertPopupRub';

const requestCallbackNames = {
    [SFS2X.Requests.Handshake]: SFS2X.SFSEvent.HANDSHAKE,
    [SFS2X.Requests.Login]: SFS2X.SFSEvent.LOGIN,
    [SFS2X.Requests.Logout]: SFS2X.SFSEvent.LOGOUT,
    [SFS2X.Requests.JoinRoom]: SFS2X.SFSEvent.ROOM_JOIN,
    [SFS2X.Requests.CreateRoom]: SFS2X.SFSEvent.ROOM_ADD,
    [SFS2X.Requests.GenericMessage]: SFS2X.Requests.getRequestNameFromId(SFS2X.Requests.GenericMessage),
    [SFS2X.Requests.ChangeRoomName]: SFS2X.SFSEvent.ROOM_NAME_CHANGE,
    [SFS2X.Requests.ChangeRoomPassword]: SFS2X.SFSEvent.ROOM_PASSWORD_STATE_CHANGE,
    [SFS2X.Requests.SetRoomVariables]: SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE,
    [SFS2X.Requests.SetUserVariables]: SFS2X.SFSEvent.USER_VARIABLES_UPDATE,
    [SFS2X.Requests.CallExtension]: SFS2X.SFSEvent.EXTENSION_RESPONSE,
    [SFS2X.Requests.LeaveRoom]: SFS2X.SFSEvent.USER_EXIT_ROOM,
    [SFS2X.Requests.SubscribeRoomGroup]: SFS2X.SFSEvent.ROOM_GROUP_SUBSCRIBE,
    [SFS2X.Requests.UnsubscribeRoomGroup]: SFS2X.SFSEvent.ROOM_GROUP_UNSUBSCRIBE,
    [SFS2X.Requests.SpectatorToPlayer]: SFS2X.SFSEvent.SPECTATOR_TO_PLAYER,
    [SFS2X.Requests.PlayerToSpectator]: SFS2X.SFSEvent.PLAYER_TO_SPECTATOR,
    [SFS2X.Requests.ChangeRoomCapacity]: SFS2X.SFSEvent.ROOM_CAPACITY_CHANGE,
    [SFS2X.Requests.KickUser]: SFS2X.Requests.getRequestNameFromId(SFS2X.Requests.KickUser),
    [SFS2X.Requests.BanUser]: SFS2X.Requests.getRequestNameFromId(SFS2X.Requests.BanUser),
    [SFS2X.Requests.ManualDisconnection]: SFS2X.SFSEvent.CONNECTION_LOST,
    [SFS2X.Requests.FindRooms]: SFS2X.SFSEvent.ROOM_FIND_RESULT,
    [SFS2X.Requests.FindUsers]: SFS2X.SFSEvent.USER_FIND_RESULT,
    [SFS2X.Requests.PingPong]: SFS2X.SFSEvent.PING_PONG,
    [SFS2X.Requests.SetUserPosition]: SFS2X.SFSEvent.PROXIMITY_LIST_UPDATE,
    [SFS2X.Requests.InitBuddyList]: SFS2X.SFSBuddyEvent.BUDDY_LIST_INIT,
    [SFS2X.Requests.AddBuddy]: SFS2X.SFSBuddyEvent.BUDDY_ADD,
    [SFS2X.Requests.BlockBuddy]: SFS2X.SFSBuddyEvent.BUDDY_BLOCK,
    [SFS2X.Requests.RemoveBuddy]: SFS2X.SFSBuddyEvent.BUDDY_REMOVE,
    [SFS2X.Requests.SetBuddyVariables]: SFS2X.SFSBuddyEvent.BUDDY_VARIABLES_UPDATE,
    [SFS2X.Requests.GoOnline]: SFS2X.SFSBuddyEvent.BUDDY_ONLINE_STATE_CHANGE,
    [SFS2X.Requests.InviteUsers]: SFS2X.SFSEvent.INVITATION,
    [SFS2X.Requests.InvitationReply]: SFS2X.SFSEvent.INVITATION_REPLY,
    [SFS2X.Requests.CreateSFSGame]: SFS2X.SFSEvent.ROOM_ADD,
    [SFS2X.Requests.QuickJoinGame]: SFS2X.SFSEvent.ROOM_JOIN
};

class Service {
    constructor() {
        this.client = null;
        this._eventCallbacks = {};
        this._eventScopes = {};

        this._valueQueue = [];
        this._lagPollingInterval = null;
        this._poorNetwork = false;
        this._loginData = null;
        this.isConnecting = false;
        this._pendingRequests = [];

        this._initSmartFoxClient();
    }

    _initSmartFoxClient() {

        var config = {};
        config.zone = app.config.zone;
        config.debug = app.config.debug;
        config.useSSL = app.config.useSSL;

        this.client = new SFS2X.SmartFox(config);
        this.client.setClientDetails("MOZILLA", "1.0.0");

        this._registerSmartFoxEvent();
    }

    _registerSmartFoxEvent() {

        this._removeSmartFoxEvent();

        console.log("_registerSmartFoxEvent: ");

        this.addEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin);
        this.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError);
        this.addEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection);
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost);
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume);
        this.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent);
        this.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess);
        this.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomSuccess);
        this.addEventListener(SFS2X.SFSEvent.ROOM_CREATION_ERROR, this._onCreateRoomError);
        this.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom);
        this.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom);
        this.addEventListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove);
        this.addEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariableUpdate);
        this.addEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this._onRoomVariableUpdate);
        this.addEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this._onPublicMessage);
    }

    _removeSmartFoxEvent() {
        this.removeEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin);
        this.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError);
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection);
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost);
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume);
        this.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent);
        this.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess);
        this.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError);
        this.removeEventListener(SFS2X.SFSEvent.ROOM_CREATION_ERROR, this._onCreateRoomError);
        this.removeEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom);
        this.removeEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom);
        this.removeEventListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove);
        this.removeEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariableUpdate);
        this.removeEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this._onRoomVariableUpdate);
        this.removeEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this._onPublicMessage);
    }

    _onPublicMessage(event){
        app.system.emit(SFS2X.SFSEvent.PUBLIC_MESSAGE, event);
    }

    _onUserVariableUpdate(event) {
        app.system.emit(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, event);
    }

    _onRoomVariableUpdate(event) {
        app.system.emit(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, event);
    }

    _onUserExitRoom(event) {
        app.system.emit(SFS2X.SFSEvent.USER_EXIT_ROOM, event);
    }

    _onUserEnterRoom(event) {
        app.system.emit(SFS2X.SFSEvent.USER_ENTER_ROOM, event);
    }

    _onRoomRemove(event) {
        app.system.emit(SFS2X.SFSEvent.ROOM_REMOVE, event);
    }

    _onConnection(event) {
        this.isConnecting = false;
        this._callCallback(SFS2X.SFSEvent.CONNECTION, event.success);

        this._pendingRequests.forEach(requestArgs => this.sendRequest(...requestArgs));
        this._pendingRequests = [];
    }

    _onConnectionLost(event) {

        this.isConnecting = false;
        this._pendingRequests = [];
        this.stopLagPolling();

        if (this._loginData) {
            this.connect((success) => {
                if (success) {
                    this.requestAuthen(this._loginData.username, this._loginData.password, false, this._loginData.quickLogin, this._loginData.cb);
                    this._loginData = null;
                }
            });
        } else {
            app.system.loadScene(app.const.scene.ENTRANCE_SCENE, () => {
                app.system.info("Kết nối tới máy chủ bị gián đoạn. Vui lòng đăng nhập lại!");
            });
        }

    }

    _onConnectionResume(event) {
        //Do nothing
    }

    _onExtensionEvent(event) {

        debug(event);

        if (event.cmd === app.commands.XLAG) {
            this._handleLagPollingResponse(event);
        } else if (event.cmd === app.commands.SYSTEM_MESSAGE) {
            // AlertPopupRub()

        } else {
            if (this._hasCallback(event.cmd)) {
                this._callCallbackAsync(event.cmd, event.params);
            }
            app.system.emit(event.cmd, event.params, event);
        }

    }

    _onLogin(event) {
        debug("_onLogin: ", event)
        if (event.data[app.keywords.UPDATE_PHONE_NUMBER]) {
            app.context.getMe().upn = event.data[app.keywords.UPDATE_PHONE_NUMBER] || true;
        }

        let rejoinGroup = event.data[app.keywords.LOGIN_REJOIN_ROOM_GROUP];
        if (rejoinGroup) {
            app.context.rejoinGroup = rejoinGroup;
            app.context.rejoiningGame = true;
            app.system.enablePendingGameEvent = true;
        } else {
            this._loginData = null;
            this._callCallback(SFS2X.SFSEvent.LOGIN, null, event.data);
        }

        this.startLagPolling(app.config.pingPongInterval);
    }

    _onLoginError() {
        this._loginData = null;
        this._callCallback(SFS2X.SFSEvent.LOGIN, event.data);
    }

    sendRequest(request, { cb = null, scope = null, cbName = null } = {}) {

        console.log("sendRequest: ", this.client.isConnected(), this.isConnecting);

        if (!this.client.isConnected() && !this.isConnecting) {
            console.log("_onConnectionLost sendRequest");
            this._onConnectionLost();
            return;
        }

        if (this.isConnecting) {
            this._pendingRequests.push(arguments);
            return;
        }

        if (cb) {
            let cbKey = cbName || requestCallbackNames[request._id];
            cbKey && this._addCallback(cbKey, cb, scope);
        }

        this.client.send(request);
    }

    _callCallback(key, verifyFunc, ...args) {
        let cbObj = this._getCallbackObject(key);

        if (!(verifyFunc instanceof Function)) {
            args = [verifyFunc, ...args];
            verifyFunc = undefined;
        }


        if (cbObj && (!verifyFunc || verifyFunc(cbObj.data))) {
            cbObj.cb.apply(null, args);
        }

        this._deleteCallbackObject(key);
    }

    _callCallbackAsync(key, verifyFunc, ...args) {
        app.async.series([
            (callback) => {
                this._callCallback.apply(this, [key, verifyFunc, ...args]);
            }
        ]);
    }

    _hasCallback(key) {
        return this._eventCallbacks.hasOwnProperty(key);
    }

    _getCallbackObject(key) {
        return this._eventCallbacks[key];
    }

    _deleteCallbackObject(key) {
        delete this._eventCallbacks[key];
    }

    _addCallback(key, cb, scope, data) {
        this._eventCallbacks[key] = cb instanceof Function ? { cb: cb, data: data } : undefined;
        this._addCommandToScope(key, scope);
    }

    addEventListener(eventType, handleFunc, scope = this) {
        this.client.addEventListener(eventType, handleFunc, scope);
    }

    removeEventListener(eventType, handleFunc, scope = this) {
        this.client.removeEventListener(eventType, handleFunc, scope);
    }

    /**
     * Current Smart Fox Client
     *
     * @returns {SFS2X.SmartFox}
     */
    getClient() {
        return this.client;
    }

    /**
     * Connect to server game with default host & port configuration
     * @param cb
     */
    connect(cb) {

        console.log("connect: ", cb)

        this.isConnecting = true;

        if (this.client.isConnected()) {
            this._onConnection({ success: true });
        } else {
            this._addCallback(SFS2X.SFSEvent.CONNECTION, cb);

            log(`Connecting to: ${app.config.host}:${app.config.port}`);

            this.client.connect(app.config.host, app.config.port);
        }

    }

    /**
     * Disconnect to game server
     */
    disconnect() {

        this.isConnecting = false;

        console.log("call disconnect: ")

        if (this.client.isConnected()) {
            this.client.disconnect();
        }
    }

    /**
     * Disconnect to game server and go to Login Screen
     */
    logout() {
        this.disconnect();
        app.system.loadScene(app.const.scene.ENTRANCE_SCENE);
    }

    /**
     * @param {string} username
     * @param {string} password
     * @param {function} cb
     */

    requestAuthen(username, password, isRegister = false, isQuickLogin = false, cb) {
        new Fingerprint2().get((printer) => {
            let data = {};
            data[app.keywords.IS_REGISTER] = isRegister;
            data[app.keywords.RAW_PASSWORD] = password;
            data[app.keywords.APP_SECRET_KEY] = "63d9ccc8-9ce1-4165-80c8-b15eb84a780a"; //
            // data[app.keywords.APP_VERSION_KEY] = "1.0.1"; //
            // data[app.keywords.VERSION] = "1.0.0"; //
            data[app.keywords.DEVICE_ID] = printer;
            data[app.keywords.QUICK_PLAY] = isQuickLogin; // <-- die here!

            if (isRegister) {
                data[app.keywords.PARTNER_ID] = 1; // <-- or here
                this._loginData = null;
            }

            // else {
            //     this._loginData = { username: username, password: password, quickLogin: isQuickLogin, cb: cb };
            // }

            this._addCallback(SFS2X.SFSEvent.LOGIN, cb);

            this.sendRequest(new SFS2X.Requests.System.LoginRequest(username, password, data, app.config.zone));
        });
    }

    _checkConnection() {
        if (!this.client.isConnected()) {
            app.system.loadScene(app.const.scene.LOGIN_SCENE);
        }
    }

    /**
     * @param {object} options  - Object data want to send via ExtensionRequest or other instance of RequestObject:
     *      + cmd: Command
     *      + data: Param object going to send to server
     *      + room: Specially room scope, null or undefined if is global scope (zone scope in smart fox)
     *
     * @param {function} cb - Callback function on server responses
     *
     */
    send(options, cb, scope) {

        if (!options) return;

        if (!this.client.isConnected()) {
            console.log("_onConnectionLost  send ");
            this._onConnectionLost();
            return;
        }

        if (options instanceof SFS2X.Requests._BaseRequest) {
            this.sendRequest(options);
        } else {
            const cmd = options.cmd;
            if (cmd) {
                this._addCallback(cmd, cb, scope, options.data);
                this.sendRequest(new SFS2X.Requests.System.ExtensionRequest(cmd, options.data || {}, options.room));
            }
        }
    }

    _addCommandToScope(key, scope) {
        if (key && scope) {
            let keys = this._eventScopes[scope] || {};
            keys[key] = "";
            this._eventScopes[scope] = keys;
        }
    }

    /**
     * Remove all callback mapped with key
     * @param {string} key
     */
    removeCallback(key) {
        key && delete this._eventCallbacks[key];
    }

    /**
     *
     * @param {string} scope
     */
    removeAllCallback(scope) {
        let eventCmdObj = scope && this._eventScopes[scope];
        if (eventCmdObj) {
            let keys = Object.keys(eventCmdObj);
            keys.forEach(key => {
                delete this._eventCallbacks[key];
            });
        }

        scope && delete this._eventScopes[scope];
    }

    _onJoinRoomError(event) {
        console.log("_onJoinRoomError: ", event);
        if (event.errorCode) {
            this._hasCallback(SFS2X.SFSEvent.ROOM_JOIN_ERROR) && this._callCallbackAsync(SFS2X.SFSEvent.ROOM_JOIN_ERROR, event);
        }
    }

    _onJoinRoomSuccess(event) {
        console.log("_onJoinRoomSuccess: ", event)
        app.system.emit(SFS2X.SFSEvent.ROOM_JOIN, event);
    }

    _onCreateRoomError(event) {
        log("_onCreateRoomError: ", event);
        if (event.errorCode) {
            this._callCallbackAsync(app.commands.USER_CREATE_ROOM, event);
            this._deleteCallbackObject(app.commands.USER_CREATE_ROOM);
        }
    }

    startLagPolling(pollingInterval) {
        this.stopLagPolling();
        this.interval = pollingInterval;
        this._lagPollingInterval = setInterval(() => {
            let currentTimeInMilis = (new Date()).getTime();
            this.send({
                cmd: app.commands.XLAG,
                data: {
                    [app.keywords.XLAG_VALUE]: currentTimeInMilis
                }
            });
        }, this.interval);
    }

    stopLagPolling() {
        if (this._lagPollingInterval) {
            clearInterval(this._lagPollingInterval);
            this._valueQueue = [];
            this._lagPollingInterval = null;
        }
    }

    _handleLagPollingResponse(event) {
        if (event.cmd === app.commands.XLAG) {

            let resObj = event.params;
            let curRecVal = (new Date()).getTime();
            let curSendVal = resObj[app.keywords.XLAG_VALUE];
            if (curSendVal) {
                if (this._valueQueue.length >= app.config.pingPongPollQueueSize) {
                    this._valueQueue.splice(0, 1);
                }
                this._valueQueue.push(curRecVal - curSendVal);
                this._updatePoorNetwork();
            }
        }
    }

    _updatePoorNetwork() {
        if (this._valueQueue.length > 0) {
            let totalLatency = 0;
            this._valueQueue.forEach(value => { totalLatency += value; });
            var averageLatency = totalLatency / this._valueQueue.length;
            this._poorNetwork = averageLatency > app.config.poorNetworkThreshold;
        }
    }

}

export default new Service();