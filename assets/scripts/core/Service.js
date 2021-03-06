/**
 * Created by Thanh on 8/23/2016.
 */

import app from 'app';
import SFS2X from 'SFS2X';
import Toast from 'Toast';
import utils from 'PackageUtils';

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
        this._isShowLoginPopup = false;
        this._poorNetwork = false;
        this._loginData = null;
        this.isConnecting = false;
        this._pendingRequests = [];
        this._xlagTimeout = null;

        // this._initSmartFoxClient();
    }
    
    _initSmartFoxClient() {

        var config = {};
        config.zone = app.config.zone;
        config.debug = false;
        config.useSSL = app.config.useSSL;

        this.client = new SFS2X.SmartFox(config);
        
        let clientType = 'MOZILLA';
       
        if (app.env.isIOS()){
            clientType = 'IOS';
        }
        else if (app.env.isAndroid()){
            clientType = 'ANDROID';
        }
        this.client.setClientDetails(clientType, "1.0.0");
        //this.client.setReconnectionSeconds(120);

        this._registerSmartFoxEvent();
    }

    _registerSmartFoxEvent() {

        this._removeSmartFoxEvent();

        this.addEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin);
        this.addEventListener(SFS2X.SFSEvent.SOCKET_ERROR, this._onSocketError);
        this.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError);
        this.addEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection);
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost);
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume);
        this.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent);
        this.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, this._onJoinRoomSuccess);
        this.addEventListener(SFS2X.SFSEvent.ROOM_JOIN_ERROR, this._onJoinRoomError);
        this.addEventListener(SFS2X.SFSEvent.ROOM_CREATION_ERROR, this._onCreateRoomError);
        this.addEventListener(SFS2X.SFSEvent.USER_EXIT_ROOM, this._onUserExitRoom);
        this.addEventListener(SFS2X.SFSEvent.USER_ENTER_ROOM, this._onUserEnterRoom);
        this.addEventListener(SFS2X.SFSEvent.ROOM_REMOVE, this._onRoomRemove);
        this.addEventListener(SFS2X.SFSEvent.USER_VARIABLES_UPDATE, this._onUserVariableUpdate);
        this.addEventListener(SFS2X.SFSEvent.ROOM_VARIABLES_UPDATE, this._onRoomVariableUpdate);
        this.addEventListener(SFS2X.SFSEvent.PUBLIC_MESSAGE, this._onPublicMessage);
        this.addEventListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage);

        this.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_ADD, this._onBuddyAdd);
        this.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_REMOVE, this._onBuddyRemove);
        this.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_BLOCK, this._onBuddyBlock);
        this.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_ERROR, this._onBuddyError);
        this.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_MESSAGE, this._onBuddyMessage);
        this.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_LIST_INIT, this._onBuddyListInit);
        this.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_ONLINE_STATE_CHANGE, this._onBuddyOnlineStateChange);
        this.addEventListener(SFS2X.SFSBuddyEvent.BUDDY_VARIABLES_UPDATE, this._onBuddyVariablesUpdate);
    }

    _removeSmartFoxEvent() {
        this.removeEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin);
        this.removeEventListener(SFS2X.SFSEvent.SOCKET_ERROR, this._onSocketError);
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
        this.removeEventListener(SFS2X.SFSEvent.ADMIN_MESSAGE, this._onAdminMessage);

        this.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_ADD, this._onBuddyAdd);
        this.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_REMOVE, this._onBuddyRemove);
        this.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_BLOCK, this._onBuddyBlock);
        this.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_ERROR, this._onBuddyError);
        this.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_MESSAGE, this._onBuddyMessage);
        this.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_LIST_INIT, this._onBuddyListInit);
        this.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_ONLINE_STATE_CHANGE, this._onBuddyOnlineStateChange);
        this.removeEventListener(SFS2X.SFSBuddyEvent.BUDDY_VARIABLES_UPDATE, this._onBuddyVariablesUpdate);
    }
    
    _onSocketError(event) {
        let scene = app.system.getCurrentSceneName();    
        
        if(scene && scene._errorMessageTimeout)
            clearTimeout(scene._errorMessageTimeout);
            
        app.system.hideLoader();
        // exception Scene: sences which are still presit when lost connection occurred. otherwise will be back to ENTRANCE_SCENE
        let isInOutgameScene = app._.includes([
            app.const.scene.ENTRANCE_SCENE,
            app.const.scene.LOGIN_SCENE,
            app.const.scene.REGISTER_SCENE
        ], scene);
        
        if(isInOutgameScene) {
            app.system.info(app.res.string('can_not_connect_to_server'));
        } else {
            app.system.loadScene(app.const.scene.ENTRANCE_SCENE, () => {
                app.system.info(app.res.string('can_not_connect_to_server'));
            });   
        }
    }
    
    _onBuddyAdd(event) {
        app.system.emit(SFS2X.SFSBuddyEvent.BUDDY_ADD, event);
    }

    _onBuddyRemove(event) {
        app.system.emit(SFS2X.SFSBuddyEvent.BUDDY_REMOVE, event);
    }

    _onBuddyBlock(event) {
        app.system.emit(SFS2X.SFSBuddyEvent.BUDDY_BLOCK, event);
    }

    _onBuddyError(event) {
        app.system.emit(SFS2X.SFSBuddyEvent.BUDDY_ERROR, event);
    }

    _onBuddyMessage(event) {
        app.system.emit(SFS2X.SFSBuddyEvent.BUDDY_MESSAGE, event);
    }

    _onBuddyListInit(event) {
        app.system.emit(SFS2X.SFSBuddyEvent.BUDDY_LIST_INIT, event);
    }

    _onBuddyOnlineStateChange(event) {
        app.system.emit(SFS2X.SFSBuddyEvent.BUDDY_ONLINE_STATE_CHANGE, event);
    }

    _onBuddyVariablesUpdate(event) {
        app.system.emit(SFS2X.SFSBuddyEvent.BUDDY_VARIABLES_UPDATE, event);
    }

    _onAdminMessage(event) {
        let message = event.message || "";
        let data = event.data;
        app.system.emit(SFS2X.SFSEvent.ADMIN_MESSAGE, message, data);
        app.system.hideLoader()
    }

    _onPublicMessage(event) {
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
        let scene = app.system.getCurrentSceneName();
        
        if(scene && scene._errorMessageTimeout)
            clearTimeout(scene._errorMessageTimeout);
        
        this.isConnecting = false;
        this._callCallback(SFS2X.SFSEvent.CONNECTION, event.success);

        this._pendingRequests.forEach(requestArgs => this.sendRequest(...requestArgs));
        this._pendingRequests = [];
        event = null;
    }

    _onConnectionLost(event) {
        this.client.buddyManager._inited = false;
        this.isConnecting = false;
        this._pendingRequests = [];
        this.stopLagPolling();

        let isLoggedIn = true;
        
        let scene = app.system.getCurrentSceneName();
        // exception Scene: sences which are still presit when lost connection occurred. otherwise will be back to ENTRANCE_SCENE
        let isInExceptionScene = app._.includes([
            app.const.scene.ENTRANCE_SCENE,
            app.const.scene.LOGIN_SCENE,
            app.const.scene.REGISTER_SCENE
        ], scene);
        if (isInExceptionScene) {
            isLoggedIn = false;
            // this._loginData && this._reConnectWithLoginData(this._loginData);
            return;
        }

        if (event && event.reason === "manual") {
            if(this._isShowLoginPopup) {
                this._changeSceneWhenDisconnect();
                this._isShowLoginPopup = false;
            } else {
                this._loginData = null;
                app.system.loadScene(app.const.scene.ENTRANCE_SCENE); 
            }
        } else {
            if (scene) {
                isLoggedIn && this._changeSceneWhenDisconnect();
            }
        }
        event = null;
    }
    
    _changeSceneWhenDisconnect() {
        app.system.loadScene(app.const.scene.ENTRANCE_SCENE, () => {
            if(this._loginData) {
                let okBtn = this._reConnectWithLoginData.bind(this, this._loginData);
                app.system.confirm(app.system.kickMessage || app.res.string('lost_connection'), null, okBtn);
                app.system.kickMessage && (app.system.kickMessage = null);
            } else {
                app.system.info(app.res.string('lost_connection_without_reconnect'));
            }
        });    
    }
    
    _reConnectWithLoginData(loginData) {
        this.connect((success) => {
            if (success) {
                let { username, password, isQuickLogin, cb, accessToken, facebookId, tempRegister } = loginData;
                this.requestAuthen(username, password, false, isQuickLogin, accessToken, facebookId, cb, tempRegister);
            }
        });
    }

    _onConnectionResume(event) {
        //Do nothing
    }

    _onExtensionEvent(event) {
        debug(event);
        if (event.cmd === app.commands.XLAG) {
            this._handleLagPollingResponse(event);
        } else if (event.cmd === app.commands.SYSTEM_MESSAGE) {
            let params = event[app.keywords.BASE_EVENT_PARAMS];
            let messageType = params && params[app.keywords.ADMIN_MESSAGE_TYPE];
            let messageList = params && params[app.keywords.ADMIN_MESSAGE_LIST];
            let duration = (params && params.duration * 1000) || Toast.LONG_TIME;
            let title = params && params.title;

            messageList && messageList.length > 0 && messageList.forEach(message => {
                messageType === app.const.adminMessage.TOAST ? app.system.showToast(message, duration) : title ? app.system.info(title, message) : app.system.info(message);
            });
        } else if (event.cmd === app.commands.CLIENT_CONFIG) {
            this._dispatchClientConfig(event.params);
        } else if (event.cmd === app.commands.USER_DISCONNECTED) {
            this._onUserDisconnected(event.params);
            app.system.emit(event.cmd, event.params, event);
        } else {
            if (this._hasCallback(event.cmd)) {
                this._callCallbackAsync(event.cmd, event.params);
            }

            app.system.emit(event.cmd, event.params, event);
        }
        event = null;
    }
    
    _onUserDisconnected(data = {}){
        let username =  utils.getValue(data, app.keywords.USER_NAME, "");
        let roomName =  utils.getValue(data, app.keywords.ROOM_NAME, "");
        
        if(roomName.length > 0 && username.length > 0){
            
            let joinedRoom = this.client.getRoomByName(roomName);
            
            if(joinedRoom){
                joinedRoom._removeUser(username)
            }
            
            this.client.userManager._removeUser(username);
        }
    }
    
    _onLogin(event) {
        this.client._socketEngine.reconnectionSeconds = Math.max(0, this.client._socketEngine.reconnectionSeconds - 30);

        if (event.data[app.keywords.UPDATE_PHONE_NUMBER]) {
            app.context.getMe()[app.keywords.UPDATE_PHONE_NUMBER] = event.data[app.keywords.UPDATE_PHONE_NUMBER] || true;
        }

        let rejoinGroup = event.data[app.keywords.LOGIN_REJOIN_ROOM_GROUP];

        if (rejoinGroup) {
            app.context.rejoinGroup = rejoinGroup;
            app.context.rejoiningGame = true;
            app.system.enablePendingGameEvent = true;
        } else {
            // this._loginData = null;

            this._callCallback(SFS2X.SFSEvent.LOGIN, null, event.data);
        }
        
        this.startLagPolling(app.config.pingPongInterval);
    }

    _onLoginError(event) {
        this._loginData = null;
        app.system.hideLoader();
        this._callCallback(SFS2X.SFSEvent.LOGIN, event, null);
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
        this._eventCallbacks[key] = null;
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
        
        this.isConnecting = true;

        if (this.client.isConnected()) {
            this._onConnection({ success: true });
        } else {
           
            if(this.client._socketEngine.isConnecting) {
                this.client._socketEngine.isConnecting = false;
                this.isConnecting = false;
                this.client._socketEngine.reconnectionSeconds = 0;
                this.client.disconnect();
                setTimeout(() => {
                    this.connect();
                }, 200);
                return;
            }
            this._addCallback(SFS2X.SFSEvent.CONNECTION, cb);
            this.client.connect(app.config.host, app.config.port);
        }

    }

    /**
     * Disconnect to game server
     */
    disconnect() {
        this.isConnecting = false;
        if (this.client.isConnected()) {
            this.client._socketEngine.reconnectionSeconds = 0;
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

    requestAuthen(username = "", password = "", isRegister = false, isQuickLogin = false, accessToken = null, facebookId = null, cb, tempRegister = false) {
        if(this.client.me) {
            this.sendRequest(new SFS2X.Requests.System.LogoutRequest());
            setTimeout(() => {
                this.requestAuthen(username,password,isRegister,isQuickLogin,accessToken,facebookId,cb, tempRegister);
            }, 200);
            return;
        }
        
        app.context && (app.context.ctl = null);
        
        let data = {};
        data[app.keywords.IS_REGISTER] = isRegister;
        data[app.keywords.APP_SECRET_KEY] = app.config.app_secret_key;
        data['isMobile'] = app.env.isMobile();
        tempRegister && (data['tempRegister'] = tempRegister);
        facebookId && (data[app.keywords.FACEBOOK_ID] = facebookId);
        data[app.keywords.DEVICE_ID] = app.config.DEVICE_ID;
        data[app.keywords.VERSION] = app.config.version;
        data[app.keywords.QUICK_PLAY] = isQuickLogin;

        if(password){
            data[app.keywords.RAW_PASSWORD] = password;
        }

        if (accessToken && accessToken.length > 0) {
            data[app.keywords.ACCESS_TOKEN] = accessToken;
        }
        
        if (app.env.isMobile()) {
            data[app.keywords.PACKAGE_NAME]  = app.config.packageName;
            data[app.keywords.BUILD_TYPE] = app.config.buildType;
        }
        
        // if (isRegister) {
            data[app.keywords.PARTNER_ID] = app.getPartnerId();
            data[app.keywords.UTM_SOURCE] = cc.sys.localStorage.getItem('utm_source') || "";
            data[app.keywords.UTM_UTM_MEDIUM] = cc.sys.localStorage.getItem('utm_utm_medium') || "";
            data[app.keywords.UTM_CAMPAIGN] = cc.sys.localStorage.getItem('utm_campaign') || "";
        // }

        this._loginData = { username, password, isQuickLogin, accessToken, facebookId, cb, tempRegister };
        
        this._addCallback(SFS2X.SFSEvent.LOGIN, cb);

        app.system.showLoader(app.res.string('sending_login_data'));
        
        this.sendRequest(new SFS2X.Requests.System.LoginRequest(username, password, data, app.config.zone));
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
            log("_onConnectionLost  send ");
            this._onConnectionLost();
            return;
        }

        if (options instanceof SFS2X.Requests._BaseRequest) {
            this.sendRequest(options);
        } else {
            const cmd = options.cmd;
            const cbKey = options.cbKey || options.cmd;
            if (cmd) {
                if ((!scope) && cb) {
                    scope = app.system.getCurrentSceneName();
                }
                this._addCallback(cbKey, cb, scope, options.data);
                this.sendRequest(new SFS2X.Requests.System.ExtensionRequest(cmd, options.data || {}, options.room));
            }
        }
        // window.free(options);
    }

    _addCallback(key, cb, scope, data) {
        this._eventCallbacks[key] = cb instanceof Function ? { cb: cb, data: data } : undefined;
        this._addCommandToScope(key, scope);
    }

    _addCommandToScope(key, scope) {
        if (key && scope) {
            let keys = this._eventScopes[scope] || {};
            keys[key] = "";
            this._eventScopes[scope] = keys;
        }
    }

    sendRequest(request, { cb = null, scope = null, cbName = null } = {}) {

        log("sendRequest: ", this.client.isConnected(), request);

        if (!this.client.isConnected() && !this.isConnecting) {
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

    /**
     * Remove all callback mapped with key
     * @param {string} key
     */
    removeCallback(key) {
        key && (this._eventCallbacks[key] = null);
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
                this._eventCallbacks[key] = null;
            });
        }

        scope && (this._eventScopes[scope] = null);
    }

    _onJoinRoomError(event) {
        log("_onJoinRoomError: ", event);
        if (event.errorCode) {
            this._hasCallback(SFS2X.SFSEvent.ROOM_JOIN_ERROR) && this._callCallbackAsync(SFS2X.SFSEvent.ROOM_JOIN_ERROR, event);
            app.system.hideLoader()
            // app.system.error(app.getRoomErrorMessage(event) || event.errorMessage);
        }
    }

    _onJoinRoomSuccess(event) {
        log("_onJoinRoomSuccess: ", event);
        app.system.emit(SFS2X.SFSEvent.ROOM_JOIN, event);
    }

    _onCreateRoomError(event) {
        if (event.errorCode) {
            this._callCallbackAsync(app.commands.USER_CREATE_ROOM, event);
            this._deleteCallbackObject(app.commands.USER_CREATE_ROOM);
            app.system.hideLoader();
            app.system.error(app.getRoomErrorMessage(event) || event.errorMessage);
        }
    }

    startLagPolling(pollingInterval) {
        this.stopLagPolling();
        this._lagPollingInterval = setInterval(() => {
            let currentTimeInMilis = (new Date()).getTime();
            // set timeout for disconnection 
            this._xlagTimeout = setTimeout(() => {
                if(app.context.isJoinedGame()) {
                    // send refresh
                    this.send({
                        cmd: app.commands.GET_CURRENT_GAME_DATA,
                        room: app.context.currentRoom
                    });
                    
                    // manually disconnect if nothing no response in 4s
                    this._gameDataTimeout = setTimeout(() => {
                        this._showReloginPopupWhenDiconnectivity();
                    }, 4 * 1000);
                } else {
                    this._showReloginPopupWhenDiconnectivity();
                }
            }, pollingInterval * 2);
            
            // send xlag request
            this.send({
                cmd: app.commands.XLAG,
                data: {
                    [app.keywords.XLAG_VALUE]: currentTimeInMilis
                }
            });
            
        }, pollingInterval);
    }

    stopLagPolling() {
        if (this._lagPollingInterval) {
            clearInterval(this._lagPollingInterval);
            this._valueQueue = [];
            this._lagPollingInterval = null;
        }
        this._xlagTimeout && clearTimeout(this._xlagTimeout);
        this._gameDataTimeout && clearTimeout(this._gameDataTimeout);
    }
    
    _showReloginPopupWhenDiconnectivity() {
        this._isShowLoginPopup = true;
        this.disconnect();
    }
    
    _handleLagPollingResponse(event) {
        if (event.cmd === app.commands.XLAG) {
            let resObj = event.params;
            let curRecVal = (new Date()).getTime();
            let curSendVal = resObj[app.keywords.XLAG_VALUE];
            if (curSendVal) {
                // clear timeout
                this._xlagTimeout && clearTimeout(this._xlagTimeout);
                
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
            this._poorNetwork && this._showReloginPopupWhenDiconnectivity();
        }
    }

    manuallyDisconnect() {
        if (this.client._socketEngine.reconnectionSeconds == 0) {
            this.sendRequest(new SFS2X.Requests.System.ManualDisconnectionRequest());
        }
        this.disconnect();
    }

    _dispatchClientConfig(data) {

        let configDataStr = data && data[app.keywords.CONFIG_DATA]
        if (configDataStr) {
            try {
                let configData = JSON.parse(configDataStr);
                app.config.parseConfigData(configData);
            } catch (e) {
                app.system.onParseClientConfigError();
            }
        }
    }

}

export default new Service();