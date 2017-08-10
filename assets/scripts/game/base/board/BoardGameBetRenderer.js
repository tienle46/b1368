import BoardRenderer from 'BoardRenderer';
import utils from 'utils';

export default class BoardGameBetRenderer extends BoardRenderer {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            historicalTableNode: cc.Node,
            shakenControlNode: cc.Node,
            resultNode: cc.Node,
            resultText: cc.Label
        });
        
        this.HISTORIAL_COMPONENT = null;
        this.SHAKEN_CONTROL = null;
    }

    onEnable() {
        super.onEnable();
        this.shakenControl = this.shakenControlNode.getComponent(this.SHAKEN_CONTROL);
        this.historicalTable = this.historicalTableNode.getComponent(this.HISTORIAL_COMPONENT);
    }
    
    shakenControlAppearance(isShow = true) {
        this.shakenControl[isShow ? 'show' : 'hide'](); 
    }
    
    historicalTableAppearance(isShow = true) {
        this.historicalTable[isShow ? 'show' : 'hide']();
    }
    
    hideElements() {
        this.shakenControl.reset();
        utils.deactive(this.resultNode);
        // utils.deactive(this.shakenControlNode); // always show dish on a board
        // utils.deactive(this.historicalTable);
    }
    
    hideResult() {
        utils.deactive(this.resultNode);
    }
    
    showResult(text) {
        utils.active(this.resultNode);
        this.resultText.string = text.toUpperCase();
    }
    
    showElements() {
        this.shakenControl.reset();
        utils.active(this.shakenControlNode);
    }
    
    updateBoardResultHistory(results) {
        if(results.length < 1)
            return
        this.historicalTable.updateTableInfo(results);
    }
    
    runDishShakeAnim() {
        this.shakenControl.play();
    }
    
    isShaking() {
        return this.shakenControl.isShaking();
    }
    
    stopDishShakeAnim() {
        this.shakenControl.stop();
    }

    openBowlAnim() {
        this.shakenControl.openTheBowl();
    }
    
    placedOnDish(dots = []) {
        this.shakenControl.placedOnDish(dots);
    }
}