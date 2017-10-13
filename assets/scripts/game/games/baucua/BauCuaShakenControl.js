import app from 'app';
import TaiXiuShakenControl from 'TaiXiuShakenControl';

class BauCuaShakenControl extends TaiXiuShakenControl {
    constructor() {
        super();
        
        this.faceTypeIdToName = {
            1 : 'bau',
            2 : 'cua',
            3 : 'tom',
            4 : 'ca',
            5 : 'ga',
            6 : 'huou',
        }
    }

    /**
     * @override
     * 
     * @param {any} dice 
     * @used in TaiXiuShakenControl-> placedOnDish method
     * @returns 
     * @memberof BauCuaShakenControl <- TaiXiuShakenControl
     */
    _getDiceSpriteFrame(dice) {
        return this.dices.getSpriteFrame(this.faceTypeIdToName[dice])
    }
}

app.createComponent(BauCuaShakenControl);