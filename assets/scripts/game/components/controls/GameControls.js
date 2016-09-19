/**
 * Created by Thanh on 9/19/2016.
 */

import Component from 'Component'

export default class GameControls extends Component {
    constructor() {
        super();

        this.scene = null;
    }

    _init(scene){
        this.scene = scene;
    }
    
    setScene(scene) {
        this.scene = scene;
    }

    onLoad(){

    }

    hideAllControls(){

    }
}