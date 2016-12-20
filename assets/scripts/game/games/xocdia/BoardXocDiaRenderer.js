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
        this.statisticTable = this.statisticTableNode.getComponent('StatisticTable');
    }

    hideElements() {
        this.bowlDishControl.resetBowlPosition();

        // utils.deactive(this.dishContainerNode); // always show dish on a board
        utils.deactive(this.statisticTableNode);
    }

    showElements() {
        this.bowlDishControl.resetBowlPosition();

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

    initDots(dots = []) {
        this.bowlDishControl.initDotsArray(dots);
    }

    updateBoardResultHistory(results) {
        this.statisticTable.updateSeparateTable(results);
    }
}

app.createComponent(BoardXocDiaRenderer);