/**
 * Created by Thanh on 8/25/2016.
 */

var game = require('game')
import Component from 'Component'

export default class BaseScene extends Component {
    constructor() {
        super();
        this.loading = true;
        this.popUp = {
            default: null,
            type: cc.Prefab
        }
    }

    start() {
        this.loading = false;
        game.system.setCurrentScene(this);
    }

    onLoad() {
        console.log('base onload')
    }

    /**
     * Handle data sent from server
     *
     * @param {string} cmd - Command or request name sent from server
     * @param {object} data - Data sent according to request
     */
    handleData(cmd, data) {

    }

    test() {
        console.log('test');
    }
        
    // show popup
    addPopup() {
        var popupBase = new cc.instantiate(this.popUp);
        popupBase.position = cc.p(0, 0);

        this.node.addChild(popupBase);
    }
}

//asign