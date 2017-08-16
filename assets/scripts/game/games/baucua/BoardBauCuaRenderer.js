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
        let faceTypeIdToName = {
            1 : 'Bầu',
            2 : 'Cua',
            3 : 'Tôm',
            4 : 'Cá',
            5 : 'Gà',
            6 : 'Hươu'
        }
        
        let text = ""
        results.forEach(id => {
            text +=  faceTypeIdToName[id] + '-'
        });
        text = text.replace(/-?$/,"")
        
        this.showResult(`${text}`);
    }
}

app.createComponent(BoardBauCuaRenderer);