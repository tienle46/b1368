/**
 * Created by Thanh on 8/25/2016.
 */

var game = require('game')
import Component from 'Component'

export default class BaseScene extends Component {
    constructor() {
        super();
        this.loading = true;
    }

    start() {
        this.loading = false;
        game.system.setCurrentScene(this);
        console.log(this.cp);
    }

    onLoad(){
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
}

//asign