import app from 'app';
import TaiXiuHistoricalTable from 'TaiXiuHistoricalTable';

class BauCuaHistoricalTable extends TaiXiuHistoricalTable {
    constructor() {
        super();
        
        this.faceTypeIdToName = {
            1 : 'ca',
            2 : 'huou',
            3 : 'cua',
            4 : 'ga',
            5 : 'tom',
            6 : 'bau',
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
            this.faces[index].spriteFrame = this.facesAtlas.getSpriteFrame(this.faceTypeIdToName[face]);
        })
    }
    
    updateTableInfo(infors) {
        infors = [[1, 3, 4], [4, 4, 3], [2, 5, 6]]
        
        if(infors.length < 1)
            return
        
        //only update newest 32 cells
        let numberCellsInTable = 22
        if (infors.length > numberCellsInTable)
            infors = infors.slice(0, numberCellsInTable + 1)

        super.updateTableInfo(infors)
        
        // update dices on historical btn
        this.modifyHistoricalTitle(infors);
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
            this.historicalDices[index].spriteFrame = this.facesAtlas.getSpriteFrame(`${this.faceTypeIdToName[face]}${isLast ? '_hl' : ''}`)
        })
        
        let cell = cc.instantiate(this.childItem)
        cell.active = true;

        return cell;
    }
}

app.createComponent(BauCuaHistoricalTable);