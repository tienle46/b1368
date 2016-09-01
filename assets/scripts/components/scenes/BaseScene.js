/**
 * Created by Thanh on 8/25/2016.
 */

var game = require('game')

var BaseScene = cc.Class({
    extends: cc.Component,

    properties: {
        loading: true
    },

    ctor() {
        console.log("ctor BaseScene")
    },

    start: function () {
        this.loading = false;
        game.system.setCurrentScene(this);

    },

    // add Bkg


    /**
     * Handle data sent from server
     *
     * @param {string} cmd - Command or request name sent from server
     * @param {object} data - Data sent according to request
     */
    handleData(cmd, data){

    }
});