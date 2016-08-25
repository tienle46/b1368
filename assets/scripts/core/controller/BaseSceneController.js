/**
 * Created by Thanh on 8/25/2016.
 */

var game;

var BaseSceneController = cc.Class({
    extends: cc.Component,

    properties: {
        loading: true
    },

    ctor() {
        "use strict";
       game = require("game")
    },

    start: function () {
        this.loading = false;
        game.system.setCurrentScene(this);
    },

    /**
     * Handle data sent from server
     *
     * @param {string} cmd - Command or request name sent from server
     * @param {object} data - Data sent according to request
     */
    handleData(cmd, data){

    }
});