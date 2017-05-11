/**
 * Created by Thanh on 3/6/2017.
 */

import app from 'app';
import utils from 'utils'
import Component from 'Component';

export default class ActionComponent extends Component {

    constructor(props) {
        super(props);

        this.__isComponentEnabled = false;
        this.__endActionCb = null;
        this.isHidden = false
        this.timeoutId = 0;
    }

    runActionWithCallback(actions = [], cb = null, delay = 0){

        this.finishAllActions()

        // log("runActionWithCallback: ", this.isHidden, delay, (this.__endActionCb ? true : false))

        if(utils.isFunction(cb)){
            this.__endActionCb = cb;
        }

        if(this.isHidden){
            this.onActionFinish()
        }else{
            delay > 0 && actions.push(cc.delayTime(delay))
            cb && actions.push(cc.callFunc(() => this.onActionFinish()))

            this.node && actions.length > 0 ? this.node.runAction(cc.sequence(actions)) : this.onActionFinish()
        }
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

    onEnable(){
        super.onEnable()
        this.__isComponentEnabled = true;
        app.system.addAppStateListener(this)
    }

    onAppStateChange(state){
        if(state == 'inactive'){
            this._pausedCallback()
        }else {
            this._restoreCallback()
        }
    }

    _pausedCallback(){
        this.finishAllActions()
        // this._clearDelayUpdateHideState()
        this.isHidden = true;
    }

    _clearDelayUpdateHideState(){
        if(this.timeoutId > 0){
            clearTimeout(this.timeoutId)
            this.timeoutId = 0;
        }
    }

    _restoreCallback(){
        this.isHidden = false;

        // this.timeoutId = setTimeout(() => {
        //     this.isHidden = false;
        // }, 3000)
    }

    onDisable(){
        super.onDisable()

        app.system.removeAppStateListener(this)
        this.finishAllActions()
        // this._clearDelayUpdateHideState()
    }

    onDestroy(){
        super.onDestroy();
        this.onActionFinish();
    }

    isComponentEnabled(){
        return this.__isComponentEnabled;
    }
}

app.createComponent(ActionComponent)