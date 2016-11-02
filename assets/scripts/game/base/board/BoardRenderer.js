/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import ActorRenderer from 'ActorRenderer';

export default class BoardRenderer extends ActorRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            timeline: cc.Node,
            timelineRemainTime: cc.Label,
            timelineTextViewNode: cc.Node,
            playerPositionPrefab: cc.Prefab
        }

        this.timelineTextView = null;
    }

    onEnable(){
        super.onEnable();

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