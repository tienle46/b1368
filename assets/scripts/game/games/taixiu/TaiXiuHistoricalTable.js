import app from 'app';
import HistoricalTable from 'HistoricalTable';

class TaiXiuHistoricalTable extends HistoricalTable {
    constructor() {
        super();
        
        this.properties = this.assignProperties({
            wrapper: cc.Node,
            childLbl: cc.Label,
            faces: {
                default: [],
                type: [cc.Sprite]
            },
            facesAtlas: cc.SpriteAtlas,
            historicalDices: {
                default: [],
                type: [cc.Sprite]
            }
        });
        
        this._isShowed = false;
        this._isShowing = false;
    }

    onLoad() {
        super.onLoad();
        this.node.setPosition(cc.v2(784, 0));
        this._isShowed = false;
        this._isShowing = false;
    }
    
    /**
     * @extending
     * 
     * @param {any} infors [{faces: [], text: 'Tai'}] {}
     * @memberof TaiXiuHistoricalTable
     */
    updateTableInfo(infors) {
        if(infors.length < 1)
            return
        
        //only update newest 32 cells
        let numberCellsInTable = 22
        if (infors.length > numberCellsInTable)
            infors = infors.slice(0, numberCellsInTable + 1)

        super.updateTableInfo(infors)
        
        // update dices on historical btn
        let latestResult = infors[infors.length - 1]
        latestResult.faces.forEach((face, index) => {
            this.faces[index].spriteFrame = this.facesAtlas.getSpriteFrame(face);
        })
    }
    
    /**
     * @override
     * @param type {faces: [], text: 'Tai'}
     * @return cc.Node
     */
    modifyItem(type) {
        type.faces.forEach((face, index) => {
            this.historicalDices[index].spriteFrame = this.facesAtlas.getSpriteFrame(face)
        })
        
        let sum = type.faces.reduce((a,b) => a + b, 0)
        
        this.childLbl.string = `${type.text} ${sum}`
        this.childLbl.node.color = sum > 3 && sum <= 10 ? new cc.Color(203, 148, 21) : new cc.Color(255, 255, 255)
        
        let cell = cc.instantiate(this.childItem)
        cell.active = true;

        return cell;
    }
    
    /**
     * @override
     * 
     * @memberof TaiXiuHistoricalTable
     */
    show() {
        this.wrapper.runAction(cc.sequence(cc.callFunc(() => {
            this._isShowing = true;
        }), cc.moveTo(.1, cc.v2(-270, 0)), cc.callFunc(() => {
            this._isShowed = true;
            this._isShowing = false;
        })))
    }
    
    /**
     * @override
     * 
     * @memberof TaiXiuHistoricalTable
     */
    hide() {
        this.wrapper.runAction(cc.sequence(cc.callFunc(() => {
            this._isShowing = true;
        }), cc.moveTo(.1, cc.v2(0, 0)), cc.callFunc(() => {
            this._isShowed = false;
            this._isShowing = false;
        })))
    }
    
    toggleTable() {
        if(this._isShowing)
            return;
        
        this._isShowed ? this.hide() : this.show();    
    }
}

app.createComponent(TaiXiuHistoricalTable);