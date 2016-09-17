/**
 * Created by Thanh on 9/15/2016.
 */

import Component from 'Component'

export default class ActorRenderer extends Component {
    constructor() {
        super();

        this.loaded = false;
    }

    _initUI() {

    }

    onLoad(){
        this.loaded = true
    }
}