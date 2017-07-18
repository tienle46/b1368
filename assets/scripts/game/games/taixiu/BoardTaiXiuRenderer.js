import app from 'app';
import BoardGameBetRenderer from 'BoardGameBetRenderer';

export default class BoardTaiXiuRenderer extends BoardGameBetRenderer {
    constructor() {
        super();
        
        this.HISTORIAL_COMPONENT = 'TaiXiuHistoricalTable';
        this.SHAKEN_CONTROL = 'TaiXiuShakenControl';
    }

    displayResultFromDots(dots) {
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
}

app.createComponent(BoardTaiXiuRenderer);