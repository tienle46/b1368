import app from 'app'
import BoardTaiXiuRenderer from 'BoardTaiXiuRenderer'

export default class BoardBauCuaRenderer extends BoardTaiXiuRenderer {
    constructor() {
        super();

        this.HISTORIAL_COMPONENT = 'BauCuaHistoricalTable';
        this.SHAKEN_CONTROL = 'BauCuaShakenControl';
    }
  
    
    /**
     * @override
     * 
     * @param {Array} results 
     * @memberof BoardBauCuaRenderer
     */
    displayResult(results) {
        let sum = results.reduce((a,b) => a + b, 0);
        if(sum <= 3)
            return
        
        //[4, 10] => Xỉu, [11, 17] => Tài
        let result = sum <= 10 ? 'Xỉu' : 'Tài'
        
        this.showResult(`${sum} - ${result}`);
    }
}

app.createComponent(BoardBauCuaRenderer);