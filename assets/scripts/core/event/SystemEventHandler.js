/**
 * Created by Thanh on 8/25/2016.
 */

var SystemEventHandler = cc.Class({

    ctor() {
    },

    /**
     * Handle data sent from server
     *
     * @param {string} cmd - Command or request name sent from server
     * @param {object} data - Data sent according to request
     */
    handleData(cmd, data){

    },

    _registerSystemEventHandler(){
        this.service.registerEventListener("test", () => {console.log("Test event")});
        //TODO
    }

});

module.exports = SystemEventHandler;
