/**
 * Created by Thanh on 8/23/2016.
 */

var game = require('game')
var SFS2X = require('SFS2X')

class GameService {
    constructor() {
        this.client = null
        this._eventCallbacks = {}
        this._eventScopes = {}

        this._initSmartFoxClient()
    }

    _initSmartFoxClient(){

        var config = {}
        config.zone = game.config.zone
        config.debug = game.config.debug
        config.useSSL = game.config.useSSL

        this.client = new SFS2X.SmartFox(config)
        this.client.setClientDetails("MOZILLA", "1.0.0")

        this._registerSmartFoxEvent();
    }

    __testConnection(){
        this.connect((success) => {
            console.log("success: " + success)
            if (success) {
                this.login("crush1", "1234nm", (error, result) => {
                    if (result) {
                        console.log(`Logged in as ${game.context.getMySelf().name}`)
                    }

                    if (error) {
                        console.log("Login error: ")
                        console.log(error)
                    }
                });
            }
        });
    }

    _registerSmartFoxEvent(){

        this._removeSmartFoxEvent()

        this.addEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin)
        this.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost)
        this.addEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume)
        this.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent)

        console.log("Registered SmartFox event")
    }

    _removeSmartFoxEvent() {
        this.removeEventListener(SFS2X.SFSEvent.LOGIN, this._onLogin)
        this.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, this._onLoginError)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost)
        this.removeEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume)
        this.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent)
    }

    _onConnection(event){
        console.log("_onConnection")
        console.log(event)

        this._callCallback(SFS2X.SFSEvent.CONNECTION, event.success)
    }

    _onConnectionLost(event){
        console.log("_onConnectionLost")
        console.log(event);

        // game.system.loadScene(game.const.scene.LOGIN_SCENE);
    }

    _onConnectionResume(event){
        console.log("_onConnectionResume")
        console.log(event);
        //TODO
    }

    _onExtensionEvent(event){
        console.log("_onExtensionEvent")
        console.log(event)

        if (this._hasCallback(event.cmd)) {
            this._callCallbackAsync(event.cmd, event.params)
        } else {
            game.system.handleData(event.cmd, event.params, event)
        }

        // game.async.series([
        //     () => {this._callCallback(event.cmd, event.params)}
        //     () => {game.system.handleData(event.cmd, event.params)}
        // ]);
    }

    _onLogin(event){
        console.log("_onLogin")
        console.log(event)

        this._callCallback(SFS2X.SFSEvent.LOGIN, undefined, event.data)
    }

    _onLoginError(){
        console.log("_onLoginError")
        console.log(event)

        this._callCallback(SFS2X.SFSEvent.LOGIN, event.data)
    }

    _sendRequest(request){
        this.client.send(request)
    }

    _callCallback(key, args){
        let cb = this._getCallback(key)
        var argArr = Array.prototype.slice.call(arguments, 1)
        cb && cb.apply(null, argArr);
    }

    _callCallbackAsync(key, args){
        game.async.series([
            (callback) => {
                this._callCallback.apply(this, arguments)
            }
        ]);
    }

    _hasCallback(key)
    {
        return this._eventCallbacks.hasOwnProperty(key)
    }

    _getCallback(key)
    {
        return this._eventCallbacks[key]
    }

    _addCallback(key, cb, scope)
    {
        this._eventCallbacks[key] = cb instanceof Function ? cb : undefined
        this._addCommandToScope(key, scope);
    }

    addEventListener(eventType, handleFunc)
    {
        this.client.addEventListener(eventType, handleFunc, this)
    }

    removeEventListener(eventType, handleFunc)
    {
        this.client.removeEventListener(eventType, handleFunc, this)
    }

    /**
     * Current Smart Fox Client
     *
     * @returns {SFS2X.SmartFox}
     */
    getClient()
    {
        return this.client
    }

    /**
     * Connect to server game with default host & port configuration
     * @param cb
     */
    connect(cb)
    {
        this.disconnect()

        this._addCallback(SFS2X.SFSEvent.CONNECTION, cb)

        console.log(`Connecting to: ${game.config.host}:${game.config.port}`)

        this.client.connect(game.config.host, game.config.port)
    }

    /**
     * Disconnect to game server
     */
    disconnect()
    {
        if (this.client.isConnected()) {
            this.client.disconnect()
        }
    }

    /**
     * Disconnect to game server and go to Login Screen
     */
    logout()
    {
        disconnect();
        game.system.loadScene(game.const.scene.LOGIN_SCENE)
    }

    /**
     * @param {string} username
     * @param {string} password
     * @param {function} cb
     */
    login(username, password, cb)
    {
        let data = {};
        data[game.keywords.IS_REGISTER] = false
        data[game.keywords.PASSWORD] = password
        data[game.keywords.APP_SECRET_KEY] = "63d9ccc8-9ce1-4165-80c8-b15eb84a780a"

        this._addCallback(SFS2X.SFSEvent.LOGIN, cb)

        this._sendRequest(new SFS2X.Requests.System.LoginRequest(username, password, data, game.config.zone))
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
    send(options, cb, scope)
    {

        if (!options) return

        if (options instanceof SFS2X.Requests._BaseRequest) {
            this._sendRequest(options)
        } else {
            const cmd = options.cmd
            if (cmd) {
                this._addCallback(cmd, cb, scope)
                this._sendRequest(new SFS2X.Requests.System.ExtensionRequest(cmd, options.data || {}, options.room))
            }
        }
    }

    _addCommandToScope(key, scope){
        if(key && scope){
            let keys = this._eventScopes[scope] || {}
            keys[key] = ""
            this._eventScopes[scope] = keys
        }
    }

    /**
     * Remove all callback mapped with key
     * @param {string} key
     */
    removeCallback(key)
    {
        key && delete this._eventCallbacks[key]
    }

    /**
     *
     * @param {string} scope
     */
    removeAllCallback(scope)
    {
        let eventCmdObj = scope && this._eventScopes[scope];
        if (eventCmdObj) {
            let keys = Object.keys(eventCmdObj)
            keys.forEach(key => {
                delete this._eventCallbacks[key]
            })
        }

        scope && delete this._eventScopes[scope]
    }

}

module.exports = new GameService();