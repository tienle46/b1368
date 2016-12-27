/**
 * Created by Thanh on 9/16/2016.
 */

import app from 'app';
import utils from 'utils';
import ActorRenderer from 'ActorRenderer';
import TextView from 'TextView';

export default class BoardRenderer extends ActorRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            timeline: cc.Node,
            timelineTextViewNode: cc.Node
        }

        this.timelineTextView = null;
        this.ellipseTimeLine = null;
        this.chipPrefab = cc.Prefab;
    }

    onEnable() {
        super.onEnable();

        this.timelineTextView = this.timelineTextViewNode.getComponent('TextView');
        this.ellipseTimeLine = this.timeline.getComponent('EllipseTimeLine');
        this.hideTimeLine();
    }

    _reset() {
        this.hideTimeLine();
    }

    hideTimeLine() {
        if (this.ellipseTimeLine) {
            this.ellipseTimeLine.stop();
        }
        this.setTimeLineMessage("");
        utils.deactive(this.timeline);
    }

    showTimeLine(timeInSecond = 0, message, hiddenText = false) {
        if (timeInSecond <= 0) {
            return;
        }

        if (!utils.isString(message) || utils.isEmpty(message)) {
            message = app.res.string('game_waiting');
        }
        hiddenText && (message = '');

        utils.active(this.timeline);
        this.setTimeLineMessage(message);
        this.ellipseTimeLine.startTimeLine(timeInSecond);
    }

    setTimeLineMessage(message) {
        this.timelineTextView.setText(message);
    }
}

app.createComponent(BoardRenderer);