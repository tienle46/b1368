/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import BoardRenderer from 'BoardRenderer';

export default class BoardCardRenderer extends BoardRenderer {
    constructor() {
        super();
    }

    _initUI(data){
        super._initUI(data);
    }
}

app.createComponent(BoardCardRenderer)