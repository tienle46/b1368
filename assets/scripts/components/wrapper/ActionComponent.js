/**
 * Created by Thanh on 3/6/2017.
 */

import app from 'app';
import utils from 'utils'
import Component from 'Component';

class ActionComponent extends Component {

    constructor(props) {
        super(props);

        this.__endActionCb = null;
    }

    runActionWithCallback(actions = [], cb = null, delay = 0){

        this.finishAllActions()

        if(utils.isFunction(cb)){
            this.__endActionCb = cb;
        }

        delay > 0 && actions.push(cc.delayTime(delay))
        cb && actions.push(cc.callFunc(() => this.onActionFinish()))


        console.warn('runActionWithCallback: ', this.node, actions.length);

        this.node && actions.length > 0 ? this.node.runAction(cc.sequence(actions)) : this.onActionFinish()
    }

    finishAllActions(){
        this.node && this.node.stopAllActions();
        this.onActionFinish();
    }

    onActionFinish(){
        if (this.__endActionCb) {
            let endAction = this.__endActionCb;
            this.__endActionCb = null;
            endAction();
        }
    }

    onDisable(){
        super.onDisable()
        this.onActionFinish();
    }

    onDestroy(){
        super.onDestroy();
        this.onActionFinish();
    }
}

app.createComponent(ActionComponent)