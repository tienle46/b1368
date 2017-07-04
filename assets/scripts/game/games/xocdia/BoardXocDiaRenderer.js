import app from 'app';
import BoardRenderer from 'BoardRenderer';
import utils from 'utils';

export default class BoardXocDiaRenderer extends BoardRenderer {
    constructor() {
        super();

        this.properties = {
            ...this.properties,
            dishContainerNode: cc.Node,
            statisticTableNode: cc.Node,
            resultNode: cc.Node,
            resultText: cc.Label
        }
    }

    onEnable() {
        super.onEnable();

        this.bowlDishControl = this.dishContainerNode.getComponent('BowlDishControl');
        this.statisticTable = this.statisticTableNode.getComponent('StatisticTable');
    }

    hideElements() {
        this.bowlDishControl.resetBowlPosition();
        utils.deactive(this.resultNode);
        // utils.deactive(this.dishContainerNode); // always show dish on a board
        // utils.deactive(this.statisticTableNode);
    }

    displayResultFromDots(dots) {
        debug('getResultTextFromDots', dots);
        //0: even, 1: odd
        let evenCount = 0;
        for (let i = 0; i < dots.length; i++) {
            let dot = dots[i];
            dot === 0 && evenCount++;

            if (i === dots.length - 1) {
                if (evenCount === 4 || evenCount === 0) {
                    let type = evenCount > 0 ? 'Trắng' : 'Đỏ';

                    this.showResult(`4 ${type} - Chẵn`);
                    return;
                }

                let odd = 4 - Math.abs(evenCount);
                let type = odd - evenCount === 0 ? 'Chẵn' : 'Lẻ';

                this.showResult(`${evenCount} Trắng ${odd} Đỏ - ${type}`);
                return;
            }
        }
    }

    hideResult() {
        utils.deactive(this.resultNode);
    }

    showResult(text) {
        utils.active(this.resultNode);
        this.resultText.string = text.toUpperCase();
    }

    showElements() {
        this.bowlDishControl.resetBowlPosition();

        utils.active(this.dishContainerNode);
        // utils.active(this.statisticTableNode);
    }

    runDishShakeAnim() {
        this.bowlDishControl.dishShaker();
    }
    
    isShaking() {
        return this.bowlDishControl.isShaking();
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