/**
 * Currently HighLightMessageRub just only contains messages get from responsed server command "hm" 
 * 
 * @export
 * @class HighLightMessageRub
 */
import app from 'app';

export default class HighLightMessageRub {
    constructor() {
        this.messages = {};
        this.intervalTimer = null;
        this.highLightNode = null;
        
        this._currentIndex = 0;
    }
    
    //TODO
    // addEventListeners() {
    //     app.system.on('2lightmessage_updated', this._onHLMUpdated);
    // }
    
    // removeEventListeners() {
    //     app.system.off('2lightmessage_updated', this._onHLMUpdated);
    // }
    
    // message: {msg, rc}
    pushMessage(message) {
        let updated = false;
        // if(this.messages[message.msg]) {
        //     updated = this.getRepeatCount(this.messages[message.msg]) != message.rc;
        // }
        this.setMessage(message, updated);
    }

    getMessages() {
        return this.messages;
    }
    
    getMessage() {
        return this.getFirstMessage();
    }
    
    getFirstMessage() {
        let firstKey = Object.keys(this.messages)[this._currentIndex];
        return firstKey && this.messages[firstKey];
    }
    
    setMessage(message, updated = false) {
        this.messages[message.msg] = {
            msg: message.msg,
            rc: message.rc,
            updated
        };
        // if(updated) {
        //     app.system.emit('2lightmessage_updated', this.messages[message.msg]);
        // }
    }
    
    getRepeatCount(message) {
        return message.rc;
    }
    
    getLastMessage() {
        let lastKey = Object.keys(this.messages)[Object.keys(this.messages).length - 1];
        return lastKey && this.messages[lastKey];
    }
    
    removeMessage(message) {
        if(message.rc == 0) {
            this.messages[message.msg] = null;
            delete this.messages[message.msg];
        }
    }
    
    runMessage(intervalTimer, highLightNode) {
        if(this.isEmptyStack())
            return;
            
        let hlm = this.getMessage();
        
        if(this._currentIndex >= Object.keys(this.messages).length) {
            this._currentIndex = 0;
        } else {
            this._currentIndex ++;
        }
        
        /**
         * hlm -> pause interval -> display message -> resume -> hlm
         */
        if (hlm && highLightNode && intervalTimer) {
            this.intervalTimer = intervalTimer;
            this.highLightNode = highLightNode;
            
            // pause timer
            this.intervalTimer.pause();
            
            // show hight light
            let txt = this.highLightNode.getComponent(cc.RichText) || this.highLightNode.getComponent(cc.label);
            // update text
            txt.string = hlm.msg;            
            
            this._runAnim(hlm);
        }
    }
    
    isEmptyStack() {
        return Object.keys(this.messages).length === 0;
    }
    
    _runAnim(hlm) {
        if(!this.highLightNode || !this.intervalTimer)
            return;
        let txtWidth = this.highLightNode.getContentSize().width;
        let montorWidth = cc.director.getWinSize().width;
        let nodePositionY = this.highLightNode.getPosition().y;

        let movingTime = (txtWidth + montorWidth / 2) / 85;
        let endPosition = cc.v2(0 - txtWidth - montorWidth / 2, nodePositionY);

        let action = cc.moveTo(movingTime, endPosition);
        
        let startPosition = cc.v2(this.highLightNode.getPosition());
        this._resetHighLightPosition();

        let rp = cc.sequence(action, cc.callFunc(() => {
            this.highLightNode.setPosition(startPosition);
            // if complete counting, resume timer interval
            hlm.rc--;
            this.removeMessage(hlm);
            this.intervalTimer.resume();
        }));

        this.highLightNode.runAction(rp);   
    }
    
    _onHLMUpdated(message) {
        if(message.updated) {
            this._resetHighLightPosition();
            this._runAnim(message);
            message.updated = false;
        }
    }
    
    _resetHighLightPosition() {
        if(!this.highLightNode)
            return;
            
        let startPosition = cc.v2(this.highLightNode.getPosition());
        this.highLightNode.stopAllActions();
        this.highLightNode.setPosition(startPosition);
    }
}