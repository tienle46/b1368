/**
 * Created by Thanh on 8/23/2016.
 */

var app = require('app')
var SFS2X = require('SFS2X')
var Fingerprint2 = require('fingerprinter');

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
}

class GameService {
    constructor() {
        this.client = null
        this._eventCallbacks = {};
        this._eventScopes = {};

        this._initSmartFoxClient()
    }

    _initSmartFoxClient() {

        var config = {}
        config.zone = app.config.zone
        config.debug = app.config.debug
        config.useSSL = app.config.useSSL

        this.client = new SFS2X.SmartFox(config)
        this.client.setClientDetails("MOZILLA", "1.0.0")

        this._registerSmartFoxEvent();
    }

    __testConnection() {
        this.connect((success) => {
            console.log("success: " + success)
            if (success) {
                this.login("crush1", "1234nm", (error, result) => {
                    if (result) {
                        console.log(`Logged in as ${app.context.getMe().name}`)
                    }

                    if (error) {
                        console.log("Login error: ")
                        console.log(error)
                    }
                });
            }
        });
    }

    _registerSmartFoxEvent() {

        this._removeSmartFoxEvent()

        this.addEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin)
        this.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume)
        this.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent)
        this.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomResult)
        this.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomResult)
        this.addEventListener(SFS2X.SFSEvent.ROOM_CREATION_ERROR, this._onCreateRoomResult)
        this.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom)
        this.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom)
        this.addEventListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove)
    }

    _removeSmartFoxEvent() {
        this.removeEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin)
        this.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume)
        this.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent)
        this.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomResult)
        this.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomResult)
        this.removeEventListener(SFS2X.SFSEvent.ROOM_CREATION_ERROR, this._onCreateRoomResult)
        this.removeEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom)
        this.removeEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom)
        this.removeEventListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove)
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
        this._callCallback(SFS2X.SFSEvent.CONNECTION, event.success)
    }

    _onConnectionLost(event) {
        app.system.loadScene(app.const.scene.ENTRANCE_SCENE, () => {
            app.system.info("Kết nối tới máy chủ bị gián đoạn. Vui lòng đăng nhập lại!");
        });
    }

    _onConnectionResume(event) {
        console.log("_onConnectionResume")
        console.log(event);
    }

    _onExtensionEvent(event) {

        if (this._hasCallback(event.cmd)) {
            this._callCallbackAsync(event.cmd, event.params)
        } else {
            app.system.emit(event.cmd, event.params, event)
        }
    }

    _onLogin(event) {
        this._callCallback(SFS2X.SFSEvent.LOGIN, null, event.data)
    }

    _onLoginError() {
        this._callCallback(SFS2X.SFSEvent.LOGIN, event.data)
    }

    sendRequest(request, { cb = null, scope = null, cbName = null } = {}) {
        if (cb) {
            let cbKey = cbName || requestCallbackNames[request._id]
            cbKey && this._addCallback(cbKey, cb, scope)
        }

        this.client.send(request)
    }

    _callCallback(key, verifyFunc, ...args) {
        let cbObj = this._getCallbackObject(key);

        if (!(verifyFunc instanceof Function)) {
            args = [verifyFunc, ...args];
            verifyFunc = undefined;
        }

        console.log("call callback ")
        console.log(args)


        if (cbObj && (!verifyFunc || verifyFunc(cbObj.data))) {
            cbObj.cb.apply(null, args);
        }
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

        if (this.client.isConnected()) {
            this._onConnection({ success: true })
        } else {
            this._addCallback(SFS2X.SFSEvent.CONNECTION, cb);

            console.log(`Connecting to: ${app.config.host}:${app.config.port}`);

            this.client.connect(app.config.host, app.config.port);
        }

    }

    /**
     * Disconnect to game server
     */
    disconnect() {
        if (this.client.isConnected()) {
            this.client.disconnect();
        }
    }

    /**
     * Disconnect to game server and go to Login Screen
     */
    logout() {
        this.disconnect();
        app.system.loadScene(app.const.scene.LOGIN_SCENE);
    }

    /**
     * @param {string} username
     * @param {string} password
     * @param {function} cb
     */

    requestAuthen(username, password, isRegister, isQickPlay, cb) {
        new Fingerprint2().get((printer, components) => {
            let data = {};
            data[game.keywords.IS_REGISTER] = isRegister;
            data[game.keywords.RAW_PASSWORD] = password;
            data[game.keywords.APP_SECRET_KEY] = "63d9ccc8-9ce1-4165-80c8-b15eb84a780a"; //
            // data[game.keywords.APP_VERSION_KEY] = "1.0.1"; //
            // data[game.keywords.VERSION] = "1.0.0"; //
            data[game.keywords.DEVICE_ID] = printer;
            data[game.keywords.QUICK_PLAY] = isQickPlay; // <-- die here!
            if (isRegister) {
                data[game.keywords.PARTNER_ID] = 1; // <-- or here
            }

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

        if (options instanceof SFS2X.Requests._BaseRequest) {
            this.sendRequest(options)
        } else {
            const cmd = options.cmd
            if (cmd) {
                this._addCallback(cmd, cb, scope, options.data)
                this.sendRequest(new SFS2X.Requests.System.ExtensionRequest(cmd, options.data || {}, options.room))
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
            })
        }

        scope && delete this._eventScopes[scope];
    }

    _onJoinRoomResult(event) {

        const key = this._hasCallback(app.commands.USER_CREATE_ROOM) ? app.commands.USER_CREATE_ROOM : SFS2X.SFSEvent.ROOM_JOIN;

        if (event.errorCode) {
            this._callCallbackAsync(key, event);
        } else {
            this._callCallbackAsync(key, data => {
                return !data || !data.roomId || (event.room && data.roomId == event.id)
            }, null, event);
        }
    }

    _onCreateRoomResult(event) {
        if (event.errorCode) {
            this._callCallbackAsync(app.commands.USER_CREATE_ROOM, event);
        }
    }
}

module.exports = new GameService();