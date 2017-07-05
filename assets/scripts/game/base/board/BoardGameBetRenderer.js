import BoardRenderer from 'BoardRenderer';
import utils from 'utils';

export default class BoardGameBetRenderer extends BoardRenderer {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            historicalTableNode: cc.Node,
            resultNode: cc.Node,
            resultText: cc.Label
        });
        
        this.HISTORIAL_COMPONENT = 'StatisticTable';
    }

    onEnable() {
        super.onEnable();
        
        this.historicalTable = this.historicalTableNode.getComponent(this.HISTORIAL_COMPONENT);
    }
    
    /**
     * @override
     */
    hideElements() {
    }

    
    hideResult() {
        utils.deactive(this.resultNode);
    }
    
    showResult(text) {
        utils.active(this.resultNode);
        this.resultText.string = text.toUpperCase();
    }
    
    /**
     * @override
     */
    showElements() {
        this.bowlDishControl.resetBowlPosition();

        utils.active(this.dishContainerNode);
        // utils.active(this.statisticTableNode);
    }
    
    /**
     * @override
     */
    updateBoardResultHistory(results) {
        this.historicalTable.updateSeparateTable(results);
    }
}