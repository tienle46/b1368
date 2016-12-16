import app from 'app';
import BoardRenderer from 'BoardRenderer';
import utils from 'utils';

export default class BoardXocDiaRenderer extends BoardRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            dishContainerNode: cc.Node,
            statisticTableNode: cc.Node
        }
    }

    onEnable() {
        super.onEnable();

        this.dishContainerNode.zIndex = 999;

        this.bowlDishControl = this.dishContainerNode.getComponent('BowlDishControl');
    }

    hideElements() {
        utils.deactive(this.dishContainerNode);
        utils.deactive(this.statisticTableNode);
    }

    showElements() {
        utils.active(this.dishContainerNode);
        utils.active(this.statisticTableNode);
    }

    runDishShakeAnim() {
        this.bowlDishControl.dishShaker();
    }

    stopDishShakeAnim() {
        this.bowlDishControl.stopDishShaker();
    }

    openBowlAnim() {
        this.bowlDishControl.openBowlAnim();
    }
}

app.createComponent(BoardXocDiaRenderer);