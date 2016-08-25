/**
 * Created by Thanh on 8/23/2016.
 */

var game;
var SFS2X = require("SFS2X");
var Keywords = require("Keywords");

var GameService = cc.Class({
    properties: {
        _sfsClient: {
            default: null
        },
        _eventCallbacks: {
            default: {}
        },

        _eventListeners: {
            default: {}
        }
    },

    ctor() {
        this._initSmartFoxClient()
    },

    _initSmartFoxClient(){

        var config = {}
        config.zone = game.config.zone
        config.debug = game.config.debug
        config.useSSL = game.config.useSSL

        this._sfsClient = new SFS2X.SmartFox(config)
        this._sfsClient.setClientDetails("MOZILLA", "1.0.0")

        this._registerSmartFoxEvent();

        this._callCallback("dsdsd");

        this.connect((success) => {
            console.debug("success: " + success)
            if (success) {
                this.login("crush1", "1234nm", (error, result) => {
                    if (result) {
                        console.debug(`Logged in as ${game.context.getUser().name}`)
                    }

                    if (error) {
                        console.debug("Login error: ")
                        console.debug(error)
                    }
                });
            }
        });
    },

    _registerSmartFoxEvent(){

        this._removeSmartFoxEvent()

        this.addEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin)
        this.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume)
        this.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent)

        console.debug("Registered SmartFox event")
    },

    _removeSmartFoxEvent() {
        this.removeEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin)
        this.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume)
        this.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent)
    },

    _onConnection(event){
        console.debug("_onConnection")
        console.debug(event)

        this._callCallback(SFS2X.SFSEvent.CONNECTION, event.success)
    },

    _onConnectionLost(event){
        console.debug("_onConnectionLost")
        console.debug(event);

        // game.system.loadScene(game.const.scene.LOGIN_SCENE);
    },

    _onConnectionResume(event){
        console.debug("_onConnectionResume")
        console.debug(event);
        //TODO
    },

    _onExtensionEvent(event){
        console.debug("_onExtensionEvent")
        console.debug(event)

        this._callCallback(event.cmd, event.params)
        this._callListener(event.cmd, event.params)
    },

    _onLogin(event){
        console.debug("_onLogin")
        console.debug(event)

        this._callCallback(SFS2X.SFSEvent.LOGIN, undefined, event.data)
    },

    _onLoginError(){
        console.debug("_onLoginError")
        console.debug(event)

        this._callCallback(SFS2X.SFSEvent.LOGIN, event.data)
    },

    _sendRequest(request){
        this._sfsClient.send(request)
    },

    _callCallback(key, args){

        let cb = this._getCallback(key)
        var argArr = Array.prototype.slice.call(arguments, 1)
        cb && cb.apply(null, argArr);
    },

    _callListener(key, args)
    {
        let listener = this._eventListeners[key]
        var argArr = Array.prototype.slice.call(arguments, 1)
        listener && listener.apply(null, argArr)
    },

    _getCallback(key)
    {
        return this._eventCallbacks[key]
    },

    _addCallback(key, cb)
    {
        this._eventCallbacks[key] = cb instanceof Function ? cb : undefined
    }
    ,

    addEventListener(eventType, handleFunc)
    {
        this._sfsClient.addEventListener(eventType, handleFunc, this)
    }
    ,

    removeEventListener(eventType, handleFunc)
    {
        this._sfsClient.removeEventListener(eventType, handleFunc, this)
    },

    /**
     * Current Smart Fox Client
     *
     * @returns {SFS2X.SmartFox}
     */
    getClient()
    {
        return this._sfsClient
    },

    /**
     * Connect to server game with default host & port configuration
     * @param cb
     */
    connect(cb)
    {
        this.disconnect()

        this._addCallback(SFS2X.SFSEvent.CONNECTION, cb)

        console.debug(`Connecting to: ${game.config.host}:${game.config.port}`)

        this._sfsClient.connect(game.config.host, game.config.port)
    },

    /**
     * Disconnect to game server
     */
    disconnect()
    {
        if (this._sfsClient.isConnected()) {
            this._sfsClient.disconnect()
        }
    },

    /**
     * Disconnect to game server and go to Login Screen
     */
    logout()
    {
        disconnect();
        game.system.loadScene(game.const.scene.LOGIN_SCENE)
    },

    /**
     * @param {string} username
     * @param {string} password
     * @param {function} cb
     */
    login(username, password, cb)
    {
        let data = {};
        data[Keywords.IS_REGISTER] = false
        data[Keywords.PASSWORD] = password
        data[Keywords.APP_SECRET_KEY] = "63d9ccc8-9ce1-4165-80c8-b15eb84a780a"

        this._addCallback(SFS2X.SFSEvent.LOGIN, cb)

        this._sendRequest(new SFS2X.Requests.System.LoginRequest(username, password, data, game.config.zone))
    },

    /**
     * @param {object} options  - Object data want to send via ExtensionRequest or other instance of RequestObject:
     *      + cmd: Command
     *      + data: Param object going to send to server
     *      + scope: Specially room scope, null or undefined if is global scope (zone scope in smart fox)
     *
     * @param {function} cb - Callback function on server responses
     *
     */
    send(options, cb)
    {

        if (!options) return

        if (options instanceof SFS2X.Requests._BaseRequest) {
            this._sendRequest(options)
        } else {
            const cmd = options.cmd
            if (cmd) {
                this._addCallback(cmd, cb)
                this._sendRequest(new SFS2X.Requests.System.ExtensionRequest(cmd, options.data ? options.data : {}, options.scope))
            }
        }
    },

    /**
     * Game service will be call this listener has registered when data send from
     *
     * @param {string} key  - Key map with listener
     * @param {function} listener - Function handle data. Function must contain 2 parameters.
     * + cmd - {string} (the command of extension request or request name)
     * + data - {object} (The data sent from server)
     *
     */
    registerEventListener(key, listener)
    {
        if (key) {
            this._eventListeners[key] = listener instanceof Function ? listener : undefined
        }
    },

    /**
     *
     * @param {string} key - Name mapped with listener
     */
    removeEventListener(key)
    {
        key && delete this._eventListeners[key]
    },

    /**
     * Remove all callback mapped with key
     * @param {string} key
     */
    removeCallback(key)
    {
        key && delete this._eventCallbacks[key]
    }

})


GameService.newInstance = function () {
    game = require("game");
    let instance = new GameService()
    return instance;
};

module.exports = GameService;