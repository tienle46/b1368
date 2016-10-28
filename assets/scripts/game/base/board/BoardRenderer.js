/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import ActorRenderer from 'ActorRenderer';

export default class BoardRenderer extends ActorRenderer {
    constructor() {
        super();

        this.timeline = cc.Node;
        this.timelineTextView = null;
        this.timelineRemainTime = cc.Label;
        this.timelineTextViewNode = cc.Node;
        this.playerPositionPrefab = cc.Prefab;
    }

    _initUI(data){
        super._initUI(data);
        this.timelineTextView = this.timelineTextViewNode.getComponent('TextView');
        utils.deactive(this.timeline);
    }

    _reset(){
        this.hideTimeLine();
    }

    hideTimeLine(){
        utils.deactive(this.timeline);
    }

    showTimeLine(timeInSecond = 0, message){
        if(timeInSecond <= 0){
            return;
        }

        if(!utils.isString(message) || utils.isEmpty(message)){
            message = app.res.string('game_waiting_time');
        }

        utils.active(this.timeline);
        this.setTimeLineMessage(message);
        this.setTimeLineRemainTime(timeInSecond);
    }

    setTimeLineMessage(message){
        this.timelineTextView.setText(message);
    }

    setTimeLineRemainTime(second){
        this.timelineRemainTime.string = `${second}`;
    }
}

app.createComponent(BoardRenderer);