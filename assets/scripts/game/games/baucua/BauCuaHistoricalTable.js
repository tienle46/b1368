import app from 'app';
import TaiXiuHistoricalTable from 'TaiXiuHistoricalTable';

class BauCuaHistoricalTable extends TaiXiuHistoricalTable {
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
     * @param {any} infors [[], [], []] {}
     * @memberof BauCuaHistoricalTable <- TaiXiuBetTypeBtn
     */
    modifyHistoricalTitle(infors) {
        // update dices on historical btn
        let latestResult = infors[infors.length - 1]
        latestResult.forEach((face, index) => {
            this.historicalDices[index].spriteFrame = this.facesAtlas.getSpriteFrame(this.faceTypeIdToName[face]);
        })
    }
    
    /**
     * @override
     * 
     * @param typeIds []
     * @param isLast boolean 
     * 
     * @memberof BauCuaHistoricalTable <- TaiXiuBetTypeBtn
     * @return cc.Node
     */
    modifyItem(typeIds, isLast) {
        typeIds.forEach((face, index) => {
            this.faces[index].spriteFrame = this.facesAtlas.getSpriteFrame(`${this.faceTypeIdToName[face]}${isLast ? '_hl' : ''}`)
        })
        
        let cell = cc.instantiate(this.childItem)
        cell.active = true;

        return cell;
    }
}

app.createComponent(BauCuaHistoricalTable);