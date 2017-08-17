/**
 * Created by Thanh on 10/14/2016.
 */

import app from 'app';
import utils from 'PackageUtils';

export default class LoadingPrefab {
    constructor() {
        this.duration = 5;
        this.message = "";
        this.payload = "";
        this.loading = false;
    }

    show(duration = 5, message, payload){
        this.duration = duration;
        this.message = message;
        this.payload = payload;
        utils.active(this.node);
    }

    update(dt){
        if(this.loading){

        }
    }

    hide(){
        this.loading = false;
        utils.deactive(this.node);
    }
}

app.createComponent(LoadingPrefab)