import app from 'app';
import Component from 'Component';
import NodeRub from 'NodeRub';

class StatisticTable extends Component {
    constructor() {
        super();

        this.oddLbl = {
            default: null,
            type: cc.Label
        };

        this.evenLbl = {
            default: null,
            type: cc.Label
        };

        this.separateSideNode = {
            default: null,
            type: cc.Node
        };

        this.cellNode = {
            default: null,
            type: cc.Node
        };
    }

    onLoad() {

    }

    updateSeparateTable(cells) {
        //only update newest 32 cells
        let numberCellsInTable = 32;
        let newDatas = cells.reverse().slice(0, numberCellsInTable + 1).reverse();

        newDatas.forEach((data) => {
            let cell = this.addChildToSeparateSide(data);

            this.separateSideNode.addChild(cell);
        });

        //0: even, 1: odd
        let evens = newDatas.filter((type) => type === 0).length;
        let odds = newDatas.filter((type) => type === 0).length;

        this.oddLbl.string = evens;
        this.evenLbl.string = odds;
    }

    // @param type:  0: even, 1: odd
    addChildToSeparateSide(type) {
        // 0: red, 1: black
        let colors = ['game/images/xocdia/ingame-xocdia-red', 'game/images/xocdia/ingame-xocdia-black'];

        let cell = cc.instantiate(this.cellNode);
        let sprite = {
            spriteFrame: colors[type],
            type: cc.Sprite.Type.SLICE,
            sizeMode: cc.Sprite.SizeMode.CUSTOM
        };

        NodeRub.addSpriteComponentToNode(cell, sprite);

        return cell;
    }
}