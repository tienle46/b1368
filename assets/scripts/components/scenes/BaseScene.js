/**
 * Created by Thanh on 8/25/2016.
 */

var game = require('game');
import Component from 'Component';
var BasePopup = require('BasePopup');

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

    // show popup
    addPopup(string = null) {
        var popupBase = new cc.instantiate(this.popUp);
        popupBase.position = cc.p(0, 0);
        popupBase.getComponent(BasePopup).setContent(string);
        this.node.addChild(popupBase, 10);
    }
}

//asign