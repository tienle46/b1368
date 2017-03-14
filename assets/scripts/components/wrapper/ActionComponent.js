/**
 * Created by Thanh on 3/6/2017.
 */

import app from 'app';
import utils from 'utils'
import Component from 'Component';

export default class ActionComponent extends Component {

    constructor(props) {
        super(props);

        this.__endActionCb = null;
        this.isHidden = false
    }

    runActionWithCallback(actions = [], cb = null, delay = 0){

        this.finishAllActions()

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

        cc.game.on(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.on(cc.game.EVENT_SHOW, this._restoreCallback, this);

    }

    _pausedCallback(){
        this.finishAllActions();
        this.isHidden = true;
    }

    _restoreCallback(){
        this.isHidden = false;
    }

    onDisable(){
        super.onDisable()

        cc.game.off(cc.game.EVENT_HIDE, this._pausedCallback, this);
        cc.game.off(cc.game.EVENT_SHOW, this._restoreCallback, this);

        this.finishAllActions()
    }

    onDestroy(){
        super.onDestroy();
        this.onActionFinish();
    }
}

app.createComponent(ActionComponent)