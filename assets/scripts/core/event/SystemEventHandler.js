/**
 * Created by Thanh on 8/25/2016.
 */

var game;

var SystemEventHandler = cc.Class({

    properties: {
        _eventListeners: {
            default: {}
        }
    },

    ctor() {
        game = require("game");
    },

    /**
     * Handle data sent from server
     *
     * @param {string} cmd - Command or request name sent from server
     * @param {object} data - Data sent according to request
     */
    handleData(cmd, data){
        game.async.series([
            () => {this._callListener(cmd, data)},
            () => {this._currentScene && this._currentScene.handleData(cmd, data)}
        ]);
    },

    _registerAllSystemEventHandler(){
        this.addSystemEventListener("test", () => {console.log("Test event")});
        //TODO
    },

    _removeAllSystemEventHandler(){
        this._eventListeners = {};
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
    addSystemEventListener(key, listener)
    {
        if (key) {
            this._eventListeners[key] = listener instanceof Function ? listener : undefined
        }
    },

    /**
     *
     * @param {string} key - Name mapped with listener
     */
    removeSystemEventListener(key)
    {
        key && delete this._eventListeners[key]
    },

    _callListener(key, args)
    {
        let listener = this._eventListeners[key]
        var argArr = Array.prototype.slice.call(arguments, 1)
        listener && listener.apply(null, argArr)
    },

    _callListenerAsync(key, args)
    {
        game.async.series([
            (cb) => {this._callListener(arguments)}
        ])
    },

});

module.exports = SystemEventHandler;
