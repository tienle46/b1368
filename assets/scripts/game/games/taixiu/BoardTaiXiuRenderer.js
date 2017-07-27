import app from 'app';
import BoardGameBetRenderer from 'BoardGameBetRenderer';

export default class BoardTaiXiuRenderer extends BoardGameBetRenderer {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            clockNode: cc.Node
        });
        
        this.HISTORIAL_COMPONENT = 'TaiXiuHistoricalTable';
        this.SHAKEN_CONTROL = 'TaiXiuShakenControl';
    }
    
    onLoad() {
        super.onLoad();
        
        this.clockNode.opacity = 0;
    }
    
    /**
     * 
     * 
     * @param {any} result text
     * @memberof BoardTaiXiuRenderer
     */
    displayResult(result) {
        console.warn('result', result);
    }
    
    toggleTable() {
        this.historicalTable.toggleTable();
    }
    
    clockAppearance(isShow = true, isRunAction = true) {
        let action = cc[isShow ? 'fadeIn': 'fadeOut'](.3);
        if(isRunAction) {
            this.clockNode.runAction(action);
        } else {
            return action;
        }
    }
    
    /**
     * 
     * @param {any} duration (seconds)
     * @memberof BoardTaiXiuRenderer
     */
    alarm(duration) {
        //TODO: vibrating animation
        this.clockNode.runAction(cc.sequence(cc.delayTime(duration + 1), cc.callFunc(() => {
            this.clockAppearance(false) 
        })));
    }
}

app.createComponent(BoardTaiXiuRenderer);