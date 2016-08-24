/**
 * Created by Thanh on 8/23/2016.
 */

var SFS2X = require("SFS2X");
var Keywords = require("Keywords");
var game = require("game");

var GameService = cc.Class({
        properties: {
            _sfsClient: {
                default: null
            },
            _eventCallbacks: {
                default: {}
            }
        },

        ctor() {
            this._initSmartFoxClient();
        },

        _initSmartFoxClient(){

            var config = {};
            config.zone = game.config.zone;
            config.debug = game.config.debug;
            config.useSSL = game.config.useSSL;

            this._sfsClient = new SFS2X.SmartFox(config);
            // this._sfsClient.setClientDetails("MOZILLA", "1.0.0")

            console.log(this._sfsClient.version, this._sfsClient._clientDetails)

            this._registerSmartFoxEvent();

            this.connect();
        },

        _registerSmartFoxEvent(){

            this._removeSmartFoxEvent();

            this.addEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection);
            this.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost);
            this.addEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume);
            this.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent);

            console.debug("Registered SmartFox event")
        },

        _removeSmartFoxEvent() {
            this.removeEventListener(SFS2X.SFSEvent.CONNECTION, this._onConnection);
            this.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, this._onConnectionLost);
            this.removeEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, this._onConnectionResume);
            this.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, this._onExtensionEvent);
        },

        _onConnection(event){
            let cb = this._eventCallbacks[SFS2X.SFSEvent.CONNECTION];
            cb && cb.call(event.success);
        },

        _onConnectionLost(event){
            console.debug("_onConnectionLost")
            console.log(event);
            //TODO
        },

        _onConnectionResume(event){
            console.debug("_onConnectionResume")
            console.log(event);
            //TODO
        },

        _onExtensionEvent(event){
            let cb = this._eventCallbacks[event.cmd];
            cb && cb.call(event.params);
        },

        _sendRequest(request){
            this._sfsClient.send(request);
        },

        addEventListener(eventType, handleFunc){
            this._sfsClient.addEventListener(eventType, handleFunc, this);
        },

        removeEventListener(eventType, handleFunc){
            this._sfsClient.removeEventListener(eventType, handleFunc, this);
        },

        getClient(){
            return this._sfsClient;
        },

        connect(cb){
            this.disconnect();

            this._eventCallbacks[SFS2X.SFSEvent.CONNECTION] = cb;

            console.debug(`Connecting to: ${game.config.host}:${game.config.port}`);

            this._sfsClient.connect(game.config.host, game.config.port)
        },

        disconnect(){
            if (this._sfsClient.isConnected()) {
                this._sfsClient.disconnect();
            }
        },

        logout(){
        },

        login(username, password, cb){
            let data = {};
            data[Keywords.REGISTED] = false;
            data[Keywords.PASSWORD] = password;

            this._sendRequest(new SFS2X.Requests.System.LoginRequest(username, password, data, game.config.zone));
        },

        /**
         * @param {object} options  - Data to send:
         *      + cmd: Command
         *      + data: Param object going to send to server
         *      + scope: Specially room scope, null or undefined if is global scope (zone scope in smart fox)
         *
         * @param {function} cb - Callback function on server responses
         *
         */
        send(options, cb){

            if (!options) return;

            if (options instanceof SFS2X.Requests._BaseRequest) {
                this._sendRequest(options);
            } else {
                const cmd = options.cmd;
                if (cmd) {
                    this._eventCallbacks[cmd] = cb instanceof Function ? cb : undefined;
                    this._sendRequest(new SFS2X.Requests.System.ExtensionRequest(cmd, options.data ? options.data : {}, options.scope));
                }
            }
        },

        removeCallback(key){
            key && delete this._eventCallbacks[key];
        }

    }
);

GameService.newInstance = function () {
    let instance = new GameService();
    return instance;
};

module.exports = GameService;